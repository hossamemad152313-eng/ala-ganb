/* منطق نقي قابل للاختبار بدون محرك الرسوميات: حفظ v2، إشارات المرور، الضرر، سلسلة المشاوير */
(function(root){
const AGL={SAVE_VER:2},clamp=(v,a,b)=>v<a?a:v>b?b:v;
AGL.defaults=()=>({ver:2,money:0,cash:0,wallet:150,rides:0,best:0,fuel:100,oil:100,burnt:0,energy:100,log:[],dmg:0,prog:{done:0,streak:0,bestStreak:0,fails:0,history:[]}});
AGL.migrate=function(raw){const d=AGL.defaults();if(!raw||typeof raw!=='object'||Array.isArray(raw))return{data:d,changed:false,from:0};
 const from=raw.ver||1,o=Object.assign(d,raw);
 for(const k of['money','cash','wallet','rides','best','fuel','oil','energy','dmg'])if(typeof o[k]!=='number'||!isFinite(o[k]))o[k]=AGL.defaults()[k];
 o.fuel=clamp(o.fuel,0,100);o.oil=clamp(o.oil,0,100);o.energy=clamp(o.energy,0,100);o.dmg=clamp(o.dmg,0,100);o.cash=Math.max(0,o.cash);o.wallet=Math.max(0,o.wallet);
 if(!Array.isArray(o.log))o.log=[];if(!o.prog||typeof o.prog!=='object')o.prog=AGL.defaults().prog;
 o.ver=2;return{data:o,changed:from<2,from};};
AGL.parseSave=function(str){if(!str)return{data:AGL.defaults(),ok:true,empty:true,changed:false,from:0};
 try{const r=AGL.migrate(JSON.parse(str));return Object.assign(r,{ok:true})}catch(e){return{data:AGL.defaults(),ok:false,corrupt:str}}};
AGL.lightState=function(i,j,axis,t){const C=24,off=(((i*7+j*13)%C)+C)%C;let u=(t+off)%C;if(axis)u=(u+12)%C;return u<10?'g':u<12?'y':'r'};
AGL.addDamage=function(cur,imp){return clamp(cur+clamp((imp-8)*.6,0,25),0,100)};
AGL.repairCost=function(d){return Math.ceil(clamp(d,0,100)*1.5)};
AGL.recordJob=function(p,ok,onTime,pay){p.done|=0;p.fails|=0;p.streak|=0;p.bestStreak|=0;p.history=p.history||[];
 if(!ok){p.fails++;p.streak=0;p.history.unshift({ok:false,t:Date.now()});p.history.length=Math.min(p.history.length,10);return 0}
 p.done++;p.streak=onTime?p.streak+1:0;p.bestStreak=Math.max(p.bestStreak,p.streak);p.history.unshift({ok:true,pay:pay|0,t:Date.now()});p.history.length=Math.min(p.history.length,10);
 return(onTime&&p.streak>0&&p.streak%3===0)?20+Math.min(p.streak,12)*2:0};

/* ===== إضافات v3: فتيس مانيوال، مطبات، تحديات المشاوير، أجرة الركاب ===== */
AGL.MB=[0,11,22,33,44,52];
AGL.manualAccel=function(g,v,gas,clutch,stall,dmg){const dm=1-.004*clamp(dmg||0,0,100),co=-Math.sign(v)*(2+Math.abs(v)*.03);g=clamp(g|0,-1,5);
 if(clutch||g===0||stall)return co;
 if(g===-1){if(!gas)return co*1.5;if(v>.3)return -14;return -9*dm*(1-Math.min(1,-v/10))}
 const top=AGL.MB[g];if(!gas)return co*1.7;if(v<-.3)return 18;
 const low=AGL.MB[g-1]*.35,lug=(g===1||v>=low)?1:Math.max(.12,v/low);if(v>top*1.04)return -6;
 return(16-g*1.6)*lug*Math.max(0,1-Math.max(0,v)/top)*dm};
AGL.hasHump=function(i,j,a){let h=(Math.imul(i+97,73856093)^Math.imul(j+131,19349663)^Math.imul(a+5,83492791))>>>0;h^=h>>>13;h=Math.imul(h,1274126177)>>>0;return h%6===0};
AGL.challengeOk=function(id,j){if(j.chv===0)return false;if(id==='smooth')return!(j.crash>0);if(id==='fast')return j.t<j.limit*.7;if(id==='sig')return!!j.sig;return true};
AGL.paxPay=function(pay,kind,n){return Math.round(pay*(kind==='ride'?1+.2*(Math.max(1,n|0)-1):1))};
root.AGL=AGL;if(typeof module!=='undefined'&&module.exports)module.exports=AGL;
})(typeof window!=='undefined'?window:globalThis);
