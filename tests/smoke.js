/* اختبار دخان بدون WebGL: يشغّل __boot و20 فريمًا بمحاكاة THREE/DOM لاكتشاف أخطاء المتغيرات والترتيب. لا يقيس الأداء ولا الرسم. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../www/index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);const main=scripts.find(s=>s.includes('window.__boot='));
const P=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='then'?undefined:k==='length'?0:k===Symbol.iterator?function*(){}:P(),apply:()=>P(),construct:()=>P(),set:()=>true,has:()=>true});
const el=()=>{const o=P();return o};
const store={};const rafs=[];
const ctx={console,Math,Date,JSON,Array,Object,Set,Map,Promise,Uint8Array,Float32Array,Int16Array,ArrayBuffer,Number,String,Symbol,parseInt,parseFloat,isNaN,isFinite,setTimeout:()=>0,clearTimeout:()=>0,setInterval:()=>0,
 document:{getElementById:()=>el(),createElement:()=>el(),querySelectorAll:()=>[],body:el(),documentElement:el(),addEventListener(){}},
 performance:{now:()=>Date.now()},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v)}},navigator:{userAgent:'node'},location:{search:''},matchMedia:()=>({matches:false}),
 requestAnimationFrame:f=>{rafs.push(f)},addEventListener(){},removeEventListener(){},devicePixelRatio:2,innerWidth:800,innerHeight:400,screen:{},ResizeObserver:undefined,speechSynthesis:undefined,THREE:P(),atob:s=>Buffer.from(s,'base64').toString('binary')};
ctx.window=ctx;ctx.MD={};ctx.TOWN=null;ctx.AT=undefined;
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../www/logic.js'),'utf8'),ctx);
vm.runInContext(main,ctx,{filename:'index-main.js'});
let ok=true;try{ctx.__boot()}catch(e){ok=false;console.log('✗ __boot threw:',e&&e.stack?e.stack.split('\n').slice(0,4).join(' | '):e)}
if(ok){console.log('✓ __boot finished; tasks registered:',Object.keys(ctx.AT||{}).length);let t=1000;try{for(let i=0;i<20&&rafs.length;i++){const f=rafs.pop();rafs.length=0;t+=16;f(t)}console.log('✓ 20 frames ran without exceptions')}catch(e){ok=false;console.log('✗ frame threw:',e&&e.stack?e.stack.split('\n').slice(0,4).join(' | '):e)}}
process.exit(ok?0:1);
