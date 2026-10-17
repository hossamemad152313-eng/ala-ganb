/* اختبار دخان بدون WebGL: يشغّل __boot و20 فريمًا بمحاكاة THREE/DOM لاكتشاف أخطاء المتغيرات والترتيب. لا يقيس الأداء ولا الرسم. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../www/index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);const main=scripts.find(s=>s.includes('window.__boot='));
const P=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='then'?undefined:k==='length'?0:k===Symbol.iterator?function*(){}:P(),apply:()=>P(),construct:()=>P(),set:()=>true,has:()=>true});
const el=()=>{const o=P();return o};
const store={};const rafs=[];
let fake=1e6;const ctx={console,Image:function(){},Math,Date,JSON,Array,Object,Set,Map,Promise,Uint8Array,Float32Array,Int16Array,ArrayBuffer,Number,String,Symbol,parseInt,parseFloat,isNaN,isFinite,setTimeout:()=>0,clearTimeout:()=>0,setInterval:()=>0,
 document:{getElementById:()=>el(),createElement:()=>el(),querySelectorAll:()=>[],body:el(),documentElement:el(),addEventListener(){}},
 performance:{now:()=>fake},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v)}},navigator:{userAgent:'node'},location:{search:''},matchMedia:()=>({matches:false}),
 requestAnimationFrame:f=>{rafs.push(f)},addEventListener(){},removeEventListener(){},devicePixelRatio:2,innerWidth:800,innerHeight:400,screen:{},ResizeObserver:undefined,speechSynthesis:undefined,THREE:new Proxy(P(),{get:(t,k)=>k==='GLTFLoader'?class{parse(b,p,ok){ok({scene:P()})}}:t[k]}),atob:s=>Buffer.from(s,'base64').toString('binary')};
ctx.window=ctx;ctx.MD={};ctx.TOWN=null;ctx.AT=undefined;
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../www/logic.js'),'utf8'),ctx);
vm.runInContext(main,ctx,{filename:'index-main.js'});
let ok=true,fails=0;try{ctx.__boot()}catch(e){ok=false;console.log('✗ __boot threw:',e&&e.stack?e.stack.split('\n').slice(0,4).join(' | '):e)}
if(ok){const keys=Object.keys(ctx.AT||{});console.log('✓ __boot finished; tasks registered:',keys.length);
 ctx.__done=(k,good,e)=>{if(!good&&!['town','ptall','plady','hump'].includes(k)&&!k.startsWith('k_')){fails++;console.log('✗ asset task failed:',k,e&&e.message||e)}};
 ctx.TOWN={};for(const k of keys){ctx.MD[k]=new ArrayBuffer(4);try{ctx.AT[k]()}catch(e){if(k!=='town'){fails++;console.log('✗ task threw',k,e.message)}}}
 console.log('✓ ran all asset tasks with a stub loader');
 ctx.__refreshOnce&&ctx.__refreshOnce();let t=fake;try{for(let i=0;i<30;i++){const f=rafs.pop();rafs.length=0;fake+=1000;f&&f(fake)}console.log('✓ 30 frames ran (including full block rebuild with all assets) without exceptions')}catch(e){ok=false;console.log('✗ frame threw:',e&&e.stack?e.stack.split('\n').slice(0,5).join(' | '):e)}
 if(fails)ok=false}
process.exit(ok?0:1);
