// 檢查圖：文字和文字重疊、線條穿過文字（不含分子內部的字）
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const f of ['morphine-biosynthesis','caffeine-structure','coumarin-derivatives','alkaloid-general','alkaloid-precursors','alkaloid-tests','flu-lifecycle']){
 await p.goto('http://localhost:8765/assets/knowledge/'+f+'.svg?'+Date.now());await p.waitForTimeout(200);
 const r=await p.evaluate(()=>{const top=document.documentElement;const inMol=e=>{let n=e.parentNode;while(n&&n!==top){if(n.tagName==='svg')return true;n=n.parentNode}return false};
  const B=e=>e.getBoundingClientRect();const T=[...document.querySelectorAll('text')].filter(t=>!inMol(t)&&t.textContent.trim()).map(t=>({t:t.textContent.trim().slice(0,24),b:B(t)}));
  const L=[...document.querySelectorAll('path,line,rect')].filter(e=>!inMol(e)&&e.parentNode.tagName!=='marker'&&!(e.tagName==='rect'&&(e.getAttribute('width')==='100%'||+e.getAttribute('width')>=document.documentElement.viewBox.baseVal.width-1)));
  const ov=(a,b,m=1)=>a.left<b.right-m&&a.right>b.left+m&&a.top<b.bottom-m&&a.bottom>b.top+m;const out=[];
  for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++)if(ov(T[i].b,T[j].b,2))out.push('字疊字: '+T[i].t+' / '+T[j].t);
  // 線穿過字：只看細長的直線段（寬或高 < 4）
  for(const e of L){if(e.tagName==='rect')continue;const d=e.getAttribute('d')||'';const segs=[...d.matchAll(/M\s*([\d.-]+)[ ,]([\d.-]+)\s*([HVL])\s*([\d.-]+)(?:[ ,]([\d.-]+))?/g)];
   for(const s of segs){const x1=+s[1],y1=+s[2];let x2=x1,y2=y1;if(s[3]==='H')x2=+s[4];else if(s[3]==='V')y2=+s[4];else{x2=+s[4];y2=+s[5]}
    const ctm=e.getScreenCTM();const P=(x,y)=>({x:ctm.a*x+ctm.e,y:ctm.d*y+ctm.f});const a=P(x1,y1),c=P(x2,y2);
    for(const t of T){const b=t.b;for(let k=0.05;k<0.96;k+=0.05){const x=a.x+(c.x-a.x)*k,y=a.y+(c.y-a.y)*k;if(x>b.left+1&&x<b.right-1&&y>b.top+2&&y<b.bottom-2){out.push('線穿過字: '+t.t);break}}}}}
  return [...new Set(out)];});
 console.log(f, r.length?r:'OK');}
await b.close()})();
