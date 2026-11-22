import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBroadcastPgn } from '../lib/lichess-broadcast.ts';
import { enrichBroadcastPlayers, needsBroadcastPlayers, createBroadcastPlayerCache, fetchBroadcastPlayerRoster } from '../lib/broadcast-players.ts';
import { playerFederation, playerFederationFlag, resolvePieceSet } from '../lib/broadcast-piece-sets.ts';
const game = (headers='') => parseBroadcastPgn(`[Event "Youth"]\n[White "Doe, Jane"]\n[Black "Smith, John"]\n[Result "*"]\n${headers}\n\n1. e4 e5 *`).games[0];
const roster = [{ name:'Doe, Jane', fideId:'101', fed:'AUS',title:'WFM',rating:1850 }, {name:'Smith, John',fed:'NZL'}];
const memory = () => {const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};};

test('enriched roster federation drives flags and adaptive pieces through the same headers', () => {
  const original=game('[WhiteFideId "101"]');
  const [enriched]=enrichBroadcastPlayers([original],roster);
  assert.equal(enriched.id,original.id);
  assert.equal(original.headers.WhiteFederation,undefined);
  assert.equal(enriched.headers.WhiteFederation,'AUS');
  assert.equal(enriched.headers.BlackFederation,'NZL');
  assert.equal(enriched.headers.WhiteTitle,'WFM');
  assert.equal(enriched.headers.WhiteElo,'1850');
  assert.equal(playerFederation(enriched.headers,'w',{}),'au');
  assert.equal(resolvePieceSet('adaptive',playerFederation(enriched.headers,'b',{})),'federation-nz');
  assert.equal(playerFederationFlag(enriched.headers,'w')?.src,'/pacific/flags/au.svg');
});

test('PGN data has priority; conflicting IDs and ambiguous names never match by guess', () => {
  const [explicit]=enrichBroadcastPlayers([game('[WhiteFideId "101"]\n[WhiteFederation "FIJ"]\n[WhiteTitle "WIM"]\n[WhiteElo "1900"]')],roster);
  assert.equal(explicit.headers.WhiteFederation,'FIJ');
  assert.equal(explicit.headers.WhiteTitle,'WIM');
  assert.equal(explicit.headers.WhiteElo,'1900');
  assert.equal(enrichBroadcastPlayers([game('[WhiteFideId "999"]')],roster)[0].headers.WhiteFederation,undefined);
  assert.equal(enrichBroadcastPlayers([game()], [...roster,{name:'Doe, Jane',fed:'FIJ'}])[0].headers.WhiteFederation,undefined);
  assert.equal(enrichBroadcastPlayers([game('[WhiteFideId "101"]')],[...roster,{name:'Other',fideId:'101',fed:'FIJ'}])[0].headers.WhiteFederation,undefined);
  assert.equal(enrichBroadcastPlayers([game('[WhiteFideId "-"]')],roster)[0].headers.WhiteFederation,'AUS');
  assert.equal(needsBroadcastPlayers([explicit]),false);
  assert.equal(needsBroadcastPlayers([game()]),true);
});

test('visiting federation flags work while adaptive keeps official fallback', () => {
  const headers={WhiteFederation:'SRB'};
  assert.equal(playerFederationFlag(headers,'w')?.src,'https://lichess1.org/assets/fide/fed/SRB.svg');
  assert.equal(playerFederation(headers,'w',{}),undefined);
  assert.equal(resolvePieceSet('adaptive',playerFederation(headers,'w',{})),'oceania-2027');
  assert.equal(playerFederationFlag({WhiteFederation:'../../bad'},'w'),undefined);
  assert.equal(playerFederationFlag({WhiteFederation:'AUS',WhiteCountry:'NZL'},'w'),undefined);
});

test('cache fetches once, deduplicates requests and persists for 24 hours', async () => {
  let calls=0; let now=1000; const storage=memory();
  const options={storage,now:()=>now,fetcher:async (url,options)=>{
    calls++;assert.equal(String(url),'/broadcast-players/7RDzDzcy.json');
    assert.equal(options.headers.Accept,'application/json');return Response.json(roster);
  }};
  const load=createBroadcastPlayerCache(options);
  const [a,b]=await Promise.all([load('7RDzDzcy'),load('7RDzDzcy')]);
  assert.equal(a[0].fed,'AUS');assert.deepEqual(a,b);assert.equal(calls,1);
  await load('7RDzDzcy');await createBroadcastPlayerCache(options)('7RDzDzcy');assert.equal(calls,1);
  now+=24*60*60*1000+1;
  await load('7RDzDzcy');assert.equal(calls,2);
});

test('empty and failed requests are cached briefly; stale rosters survive refresh failures', async () => {
  let calls=0;let now=1000;let fail=false;
  const load=createBroadcastPlayerCache({now:()=>now,fetcher:async()=>{calls++;return fail?new Response('',{status:429,headers:{'Retry-After':'1200'}}):Response.json(roster);}});
  await load('7RDzDzcy');now+=86400001;fail=true;
  assert.equal((await load('7RDzDzcy'))[0].fed,'AUS');
  now+=600001;await load('7RDzDzcy');assert.equal(calls,2);
  now+=600001;await load('7RDzDzcy');assert.equal(calls,3);
  let emptyCalls=0;
  const empty=createBroadcastPlayerCache({now:()=>now,fetcher:async()=>{emptyCalls++;return Response.json([]);}});
  await empty('7RDzDzcy');await empty('7RDzDzcy');assert.equal(emptyCalls,1);
});

test('invalid cached JSON, blocked storage and malformed rows cannot break boards', async () => {
  const load=createBroadcastPlayerCache({storage:{getItem(){return '{broken';},setItem(){throw Error('blocked');}},fetcher:async()=>Response.json([null,{}, {name:'Jane',fed:'aus',fideId:123}])});
  assert.deepEqual(await load('7RDzDzcy'),[{name:'Jane',fed:'AUS',fideId:'123'}]);
  assert.deepEqual(await load('../bad'),[]);
});

test('placeholder aliases cannot mask valid FIDE IDs, and conflicting aliases remain unresolved', () => {
  const [different] = enrichBroadcastPlayers([game('[WhiteFideId "?"]\n[WhiteFIDEID "999"]')],roster);
  assert.equal(different.headers.WhiteFederation,undefined);
  assert.equal(different.headers.WhiteFideId,'?');
  const [matching] = enrichBroadcastPlayers([game('[WhiteFideId "-"]\n[WhiteFIDEID "101"]')],roster);
  assert.equal(matching.headers.WhiteFederation,'AUS');
  const [conflict] = enrichBroadcastPlayers([game('[WhiteFideId "101"]\n[WhiteFIDEID "999"]')],roster);
  assert.equal(conflict.headers.WhiteFederation,undefined);
});


test('build-time exporter fetches and normalizes the actual Lichess roster endpoint', async () => {
  const players=await fetchBroadcastPlayerRoster('7RDzDzcy',async (url,options)=>{
    assert.equal(url,'https://lichess.org/broadcast/7RDzDzcy/players');
    assert.equal(options.headers.Accept,'application/json');
    assert.equal(options.cache,'force-cache');
    assert.equal(options.next.revalidate,86400);
    return Response.json([{name:'Jane',fideId:123,fed:'AUS'}]);
  });
  assert.deepEqual(players,[{name:'Jane',fideId:'123',fed:'AUS'}]);
});


test('an unavailable build export keeps an expired roster and suppresses repeated loads', async () => {
  let now=1000;let calls=0;
  const load=createBroadcastPlayerCache({now:()=>now,fetcher:async()=>{calls++;return Response.json(calls===1?roster:{unavailable:true});}});
  await load('7RDzDzcy');now+=86400001;
  assert.equal((await load('7RDzDzcy'))[0].fed,'AUS');
  await load('7RDzDzcy');assert.equal(calls,2);
});
