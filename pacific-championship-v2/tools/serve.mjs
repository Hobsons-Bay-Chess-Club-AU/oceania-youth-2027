// Mac preview server: standard Node.js modules only.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../preview');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf','.woff2':'font/woff2','.json':'application/json'};
const server = http.createServer((req,res)=>{
  let name;
  try { name=decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
  catch { res.writeHead(400);res.end('Bad request');return; }
  let target=path.resolve(root,'.'+name);
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try {
    if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    const stat=fs.statSync(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':stat.size});
    if(req.method==='HEAD'){res.end();return;}
    const stream=fs.createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.on('error',err=>{if(err.code==='EADDRINUSE')server.listen(0,'127.0.0.1');else{console.error(err.message);process.exitCode=1;}});
server.on('listening',()=>{
  const url=`http://127.0.0.1:${server.address().port}/`;
  console.log(`Preview: ${url}\nKeep this window open. Press Control+C to stop.\n`);
  if(process.platform==='darwin'&&!process.argv.includes('--no-open')){
    const child=spawn('/usr/bin/open',[url],{stdio:'ignore'});child.on('error',()=>console.log('Open the preview URL above in your browser.'));
  }
});
server.listen(8000,'127.0.0.1');
process.on('SIGINT',()=>{server.close();process.exit(0);});
