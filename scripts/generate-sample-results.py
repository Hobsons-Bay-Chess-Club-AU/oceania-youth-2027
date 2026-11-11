"""Generate clearly fictional pairings/results/standings for interface development."""
import json
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEDERATIONS = [('AUS','au','Australia'),('NZL','nz','New Zealand'),('FIJ','fj','Fiji'),('PNG','pg','Papua New Guinea'),('SOL','sb','Solomon Islands'),('PLW','pw','Palau'),('GUM','gu','Guam'),('NRU','nr','Nauru'),('NCL','nc','New Caledonia'),('TGA','to','Tonga'),('VAN','vu','Vanuatu'),('KIR','ki','Kiribati'),('MHL','mh','Marshall Islands')]
NAMES = ['Avery Bennett','Jordan Ellis','Taylor Morgan','Casey Rowan','Robin Hayes','Alex Mercer','Sam Arden','Riley Brooks','Jamie Rivers','Noah Quinn','Maia Hart','Leah Clarke','Isla Reed','Mika Lane','Luca Avery','Anya West','Aria North','Kai Emery','Zoe Finch','Eden Blake','Theo Sage','Nia Marlow','Leo Wren','Maya Frost','Finn Hale','Emma Shore','Lina Cross','Dylan Lake']
FORMATS = [dict(id='classical',name='Classical',timeControl='90 minutes + 30 seconds',totalRounds=9),dict(id='rapid',name='Rapid',timeControl='10 minutes + 2 seconds',totalRounds=7),dict(id='blitz',name='Blitz',timeControl='3 minutes + 2 seconds',totalRounds=9)]


def points(result, bye=1):
    if result=='bye': return bye, 0
    if result=='1/2-1/2': return .5,.5
    if result in ('1-0','1-0F'): return 1,0
    if result in ('0-1','0-1F'): return 0,1
    return 0,0


def snapshot(players, rounds, number):
    rows={p['id']:dict(rank=0,playerId=p['id'],points=0,played=0,wins=0,draws=0,losses=0,byes=0,tieBreaks=dict(buchholz=0,sonnebornBerger=0),form=[]) for p in players}
    opponents={p['id']:[] for p in players}
    for rnd in rounds:
        if rnd['number']>number:continue
        for game in rnd['pairings']:
            if game['result'] is None:continue
            a,b=points(game['result'],game.get('byePoints',1))
            for player,opponent,score in [(game['whiteId'],game['blackId'],a),(game['blackId'],game['whiteId'],b)]:
                if not player:continue
                row=rows[player];row['points']+=score;row['played']+=1
                if game['result']=='bye':row['byes']+=1;letter='B'
                elif score==1:row['wins']+=1;letter='W'
                elif score==.5:row['draws']+=1;letter='D'
                else:row['losses']+=1;letter='L'
                row['form'].append(dict(round=rnd['number'],result=letter))
                if opponent:opponents[player].append((opponent,score))
    for player,row in rows.items():
        row['tieBreaks']['buchholz']=sum(rows[other]['points'] for other,score in opponents[player])
        row['tieBreaks']['sonnebornBerger']=sum(rows[other]['points']*score for other,score in opponents[player])
    seeds={p['id']:p['seed'] for p in players}
    ordered=sorted(rows.values(),key=lambda row:(-row['points'],-row['tieBreaks']['buchholz'],-row['tieBreaks']['sonnebornBerger'],-row['wins'],seeds[row['playerId']]))
    for rank,row in enumerate(ordered,1):row['rank']=rank
    return dict(afterRound=number,provisional=next(r for r in rounds if r['number']==number)['status']!='completed',rows=ordered)


def generate():
    divisions=[]
    for age in [8,10,12,14,16,18,20]:
        for category in ['Open','Girls']:
            division_id=f'u{age}-{category.lower()}'
            count=7 if age==10 and category=='Girls' else 8
            players=[]
            for index in range(count):
                fed=FEDERATIONS[(age+index+(category=='Girls')*4)%len(FEDERATIONS)]
                rating=800+(age-8)*75+(7-index)*43
                title=('FM' if age>=18 else 'CM') if index==0 and category=='Open' and age>=16 else ('WFM' if age>=18 else 'WCM') if index==0 and category=='Girls' and age>=16 else ''
                players.append(dict(id=f'sample-{division_id}-{index+1:02}',name=NAMES[(age+index*3+(category=='Girls')*5)%len(NAMES)],title=title,seed=index+1,federation=dict(zip(['code','flag','name'],fed)),ratings=dict(classical=rating,rapid=rating-28,blitz=rating-62)))
            competitions=[]
            for format_index,fmt in enumerate(FORMATS):
                rotation=[p['id'] for p in players]
                if len(rotation)%2:rotation.append(None)
                rounds=[]
                for number in range(1,5):
                    before=snapshot(players,rounds,number-1) if rounds else None
                    before_scores={row['playerId']:row['points'] for row in before['rows']} if before else {}
                    pairings=[];board=0
                    for index in range(len(rotation)//2):
                        white,black=rotation[index],rotation[-1-index]
                        if number%2==0:white,black=black,white
                        is_bye=white is None or black is None
                        if is_bye:white,black=white or black,None
                        else:board+=1
                        if number==4:status,result='scheduled',None
                        elif number==3 and index>1:status,result='playing',None
                        else:
                            status='completed';result=['1-0','1/2-1/2','0-1','1-0'][(index+number+format_index+age//2)%4]
                        if is_bye:
                            # This sample uses an awarded bye even in the otherwise upcoming round.
                            status,result='completed','bye'
                        if number==2 and index==1 and age==16 and category=='Girls' and fmt['id']=='classical':result='1-0F'
                        game=dict(id=f'{division_id}-{fmt["id"]}-r{number}-p{index+1}',board=None if is_bye else board,whiteId=white,blackId=black,status=status,result=result,whitePointsBefore=None if number==4 else before_scores.get(white,0),blackPointsBefore=None if black is None or number==4 else before_scores.get(black,0))
                        if is_bye:game['byePoints']=1
                        pairings.append(game)
                    if fmt['id']=='classical':date=['2027-09-29T09:30:00+10:00','2027-09-29T15:00:00+10:00','2027-09-30T09:30:00+10:00','2027-09-30T15:00:00+10:00'][number-1]
                    else:date=f'2027-10-0{2 if fmt["id"]=="rapid" else 3}T{9+number:02}:00:00+10:00'
                    date=datetime.fromisoformat(date).replace(tzinfo=ZoneInfo("Australia/Melbourne")).isoformat()
                    rounds.append(dict(number=number,startsAt=date,status='completed' if number<3 else 'live' if number==3 else 'scheduled',pairings=pairings))
                    rotation=[rotation[0],rotation[-1],*rotation[1:-1]]
                updated=datetime.fromisoformat(rounds[2]['startsAt']).replace(minute=15)
                if fmt['id']=='classical':updated=updated.replace(hour=12)
                competitions.append(dict(formatId=fmt['id'],updatedAt=updated.isoformat(),rounds=rounds,standings=[snapshot(players,rounds,number) for number in range(1,4)]))
            divisions.append(dict(id=division_id,name=f'Under {age} · {category}',ageGroup=f'U{age}',category=category,players=players,competitions=competitions))
    data=dict(schemaVersion=1,isSample=True,eventName='Oceania Youth 2027',updatedAt='2027-10-03T12:15:00+11:00',timeZone='Australia/Melbourne',tieBreakDescription='Sample order: points, Buchholz, Sonneborn–Berger, wins, then starting rank. Final ranking and tie-break values will come from the official tournament source.',formats=FORMATS,divisions=divisions)
    output=ROOT/'public/tournament/sample-results.json';output.write_text(json.dumps(data,indent=2)+'\n')
    print(f'Generated {len(divisions)} divisions across {len(FORMATS)} formats; all names, ratings and results are fictional.')

if __name__=='__main__':generate()
