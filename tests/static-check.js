const fs=require('fs'),path=require('path'),vm=require('vm');const W=path.join(__dirname,'../www');let bad=0;const fail=m=>{bad++;console.log('✗',m)},pass=m=>console.log('✓',m);
const html=fs.readFileSync(path.join(W,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);let synOk=true;scripts.forEach((s,i)=>{try{new vm.Script(s,{filename:'inline'+i+'.js'})}catch(e){synOk=false;fail('syntax in inline script '+i+': '+e.message)}});if(synOk)pass('inline scripts parse ('+scripts.length+')');
for(const m of html.matchAll(/<script src="([^"]+)"/g)){if(!fs.existsSync(path.join(W,m[1])))fail('missing script '+m[1])}pass('script files exist');
const tiers=html.match(/const TIERS=(\[\[.*?\]\]),ALL=/s);if(!tiers)fail('TIERS not found');else{const T=eval(tiers[1]).flat(),files=fs.readdirSync(path.join(W,'models')).filter(f=>f.endsWith('.glb')).map(f=>f.slice(0,-4));const miss=T.filter(k=>!files.includes(k)),extra=files.filter(k=>!T.includes(k));miss.length?fail('boot keys without a file: '+miss):pass('every boot key has a .glb ('+T.length+')');extra.length?fail('models on disk not in boot list: '+extra):pass('no unused models');
 if(html.match(/ALLN=(\d+)/)&&+html.match(/ALLN=(\d+)/)[1]!==T.length)fail('ALLN mismatch');
 for(const k of T){if(k==='town')continue;const re=new RegExp("AT\\."+k+"=|AT\\[k\\]=");if(!re.test(html))fail('no AT task for '+k)}pass('AT tasks registered')}
for(const f of['manifest.webmanifest','models/town.json','capacitor.config.json'].map(f=>f==='capacitor.config.json'?path.join(__dirname,'..',f):path.join(W,f))){try{JSON.parse(fs.readFileSync(f,'utf8'))}catch(e){fail('bad JSON '+f)}}pass('JSON files valid');
for(const f of fs.readdirSync(path.join(W,'models')).filter(f=>f.endsWith('.glb'))){const b=fs.readFileSync(path.join(W,'models',f)).slice(0,4).toString();if(b!=='glTF')fail('not a GLB: '+f)}pass('GLB magic ok');
process.exit(bad?1:0);
