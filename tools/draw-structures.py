import re, sys
sys.path.insert(0,'.')
from check import S
from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
rdDepictor.SetPreferCoordGen(False)
from rdkit.Chem import AllChem, rdFMCS
from rdkit.Chem import rdCoordGen
MORPH=None
def coords(key,m):
    global MORPH
    if key in ('Thebaine','Codeinone','Codeine','Morphine','Salutaridine'):
        if MORPH is None:
            MORPH=Chem.MolFromSmiles(S['Morphine']); rdCoordGen.AddCoords(MORPH)
        if key=='Morphine':
            rdCoordGen.AddCoords(m); return
        mcs=rdFMCS.FindMCS([MORPH,m],ringMatchesRingOnly=True,completeRingsOnly=True,bondCompare=rdFMCS.BondCompare.CompareAny,atomCompare=rdFMCS.AtomCompare.CompareAny,timeout=10)
        core=Chem.MolFromSmarts(mcs.smartsString)
        rdDepictor.Compute2DCoords(m)
        ref=MORPH.GetSubstructMatch(core); tgt=m.GetSubstructMatch(core)
        cmap={t: MORPH.GetConformer().GetAtomPosition(r) for r,t in zip(ref,tgt)}
        from rdkit.Geometry import Point2D
        rdDepictor.Compute2DCoords(m,coordMap={k:Point2D(v.x,v.y) for k,v in cmap.items()})
        return
    rdCoordGen.AddCoords(m)
S.update({'glc-trans':'OC(=O)/C=C/c1ccccc1O*','glc-cis':'OC(=O)/C=C\\c1ccccc1O*'})
FONT='PingFang TC, Microsoft JhengHei, Noto Sans TC, Heiti TC, sans-serif'
def mol(key,w=190,h=150,hl_methyl=False):
    m=Chem.MolFromSmiles(S[key])
    for a in m.GetAtoms():
        if a.GetAtomicNum()==0: a.SetProp('atomLabel','glucose')
    coords(key,m)
    d=rdMolDraw2D.MolDraw2DSVG(w,h)
    o=d.drawOptions(); o.clearBackground=False; o.bondLineWidth=1.6; o.minFontSize=11; o.maxFontSize=13
    o.padding=0.08; o.addStereoAnnotation=False; o.useBWAtomPalette()
    hl=[]
    if hl_methyl:
        hl=[a.GetIdx() for a in m.GetAtoms() if a.GetSymbol()=='C' and a.GetDegree()==1 and a.GetNeighbors()[0].GetSymbol()=='N']
    if hl:
        d.DrawMolecule(m,highlightAtoms=hl,highlightBonds=[],highlightAtomColors={i:(0.98,0.80,0.76) for i in hl},highlightAtomRadii={i:0.45 for i in hl})
    else: d.DrawMolecule(m)
    d.FinishDrawing(); s=d.GetDrawingText()
    body=re.sub(r'^.*?<svg[^>]*>','',s,flags=re.S).replace('</svg>','')
    body=re.sub(r"<!-- END OF HEADER -->","",body)
    return body
def place(key,x,y,w=190,h=150,**k):
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{mol(key,w,h,**k)}</svg>'
def lab(x,y,t,cls='lab'): return f'<text class="{cls}" x="{x}" y="{y}">{t}</text>'
STYLE=f'''<style>text{{font-family:{FONT};dominant-baseline:central}} .lab{{font-size:13px;font-weight:700;fill:#24372C;text-anchor:middle}}
.sub{{font-size:12px;font-weight:700;fill:#B4533F;text-anchor:middle}} .key{{font-size:12px;font-weight:700;fill:#C0624F;text-anchor:middle}}
.hd{{font-size:15px;font-weight:800;fill:#315B43}} .tx{{font-size:13.5px;font-weight:600;fill:#24372C}} .note{{font-size:12px;font-weight:600;fill:#6E7F72;text-anchor:middle}}
.arw{{stroke:#315B43;stroke-width:2.2;fill:none}} .box{{fill:#fff;stroke:#E3DDC2;stroke-width:1.5}} .star{{fill:#FBE6E0;stroke:#E7B3A6;stroke-width:1.5}}</style>
<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M0 0L10 5L0 10z" fill="#315B43"/></marker></defs>'''
def arrow(x1,y1,x2,y2): return f'<path class="arw" d="M{x1} {y1}L{x2} {y2}" marker-end="url(#ar)"/>'
def svg(w,h,inner,title): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><!-- {title}：依講義印刷內容重畫，結構式用 RDKit 由 SMILES 產生（分子式已核對） -->{STYLE}<rect width="{w}" height="{h}" fill="#FFFFFF"/>{inner}</svg>'

import os; K=os.path.join(os.path.dirname(__file__),'..','assets','knowledge')+'/'
# ---------- Morphine ----------
CW,CH=230,200; X=[20+CW*i for i in range(4)]; g=[]
def cell(key,col,y,name,sub=None,star=False,w=190,h=150):
    x=X[col]; out=[]
    if star: out.append(f'<rect class="star" x="{x-4}" y="{y-22}" width="{w+8}" height="{h+64}" rx="12"/>'); out.append(lab(x+w/2,y-10,'★重要的中間產物','key'))
    out.append(place(key,x,y,w,h)); out.append(lab(x+w/2,y+h+12,name))
    if sub: out.append(lab(x+w/2,y+h+30,sub,'sub'))
    return ''.join(out)
y1,y2=40,250; ym=(y1+y2)/2
g.append(cell('Tyrosine',0,ym,'L-Tyrosine','前驅物'))
g.append(cell('L-Dopa',1,y1,'L-Dopa')); g.append(cell('Dopamine',2,y1,'Dopamine'))
g.append(cell('pHPAA',2,y2,'p-hydroxyphenylacetaldehyde'))
g.append(cell('Norcoclaurine',3,ym,'(S)-Norcoclaurine',star=True))
g.append(arrow(X[0]+185,ym+55,X[1]+5,y1+80)); g.append(arrow(X[0]+185,ym+95,X[2]+5,y2+75))
g.append(arrow(X[1]+190,y1+75,X[2]+5,y1+75))
g.append(lab(X[2]+95,(y1+y2)/2+95,'＋','hd').replace('class="hd"','class="hd" text-anchor="middle"'))
mx=X[3]-40
g.append(f'<path class="arw" d="M{X[2]+192} {y1+75}Q{mx} {y1+75} {mx} {ym+50}" />')
g.append(f'<path class="arw" d="M{X[2]+192} {y2+75}Q{mx} {y2+75} {mx} {ym+100}" />')
g.append(f'<rect x="{mx-34}" y="{ym+52}" width="68" height="46" rx="8" fill="#FFF6C9" stroke="#D9C46A"/>'+lab(mx,ym+66,'Mannich','note').replace('class="note"','class="lab" style="font-size:11px"')+lab(mx,ym+84,'reaction','note').replace('class="note"','class="lab" style="font-size:11px"'))
g.append(arrow(mx+34,ym+75,X[3]-6,ym+75))
y3=490
g.append(arrow(X[3]+95,ym+214,X[3]+95,y3-6))
g.append(cell('Coclaurine',3,y3,'(S)-Coclaurine')); g.append(cell('S-Reticuline',2,y3,'(S)-Reticuline'))
g.append(cell('Dehydroreticuline',1,y3,'1,2-Dehydroreticuline ion')); g.append(cell('R-Reticuline',0,y3,'(R)-Reticuline'))
for c in (3,2,1): g.append(arrow(X[c]+2,y3+75,X[c-1]+190,y3+75))
y4=740
g.append(arrow(X[0]+95,y3+176,X[0]+95,y4-6)); g.append(f'<text class="note" text-anchor="start" x="{X[0]+108}" y="{y3+212}" style="text-anchor:start">Oxidative phenolic coupling</text>')
g.append(cell('Salutaridine',0,y4,'Salutaridine')); g.append(cell('Thebaine',1,y4,'(R)-Thebaine','3 個甲基'))
g.append(cell('Codeinone',2,y4,'Codeinone')); g.append(cell('Codeine',3,y4,'(R)-Codeine','2 個甲基'))
for c in (0,1,2): g.append(arrow(X[c]+190,y4+75,X[c+1]+2,y4+75))
y5=990
g.append(arrow(X[3]+95,y4+196,X[3]+95,y5-6)); g.append(lab(X[3]+130,y4+218,'去甲基','sub'))
g.append(cell('Morphine',3,y5,'(R)-Morphine','1 個甲基'))
# 三項重點 box bottom-left
g.append(f'<rect class="box" x="20" y="{y5}" width="640" height="150" rx="12"/>')
for i,t in enumerate(['1. 前驅物：2 個 Tyrosine','2. 重要的中間產物：(S)-Norcoclaurine','3. 重要反應路徑：Mannich-type condensation','4. Thebaine（3 個甲基）→ 去甲基 → Codeine（2 個甲基）→ 去甲基 → Morphine（1 個甲基）']):
    g.append(lab(40,y5+28+i*32,t,'tx').replace('class="tx"','class="tx" text-anchor="start"'))
open(K+'morphine-biosynthesis.svg','w').write(svg(940,1200,''.join(g),'Morphine 的合成與代謝'))

# ---------- Caffeine ----------
g=[]
g.append(lab(20,28,'Caffeine：[★國考] 2,6-Dioxypurine 衍生物','hd').replace('class="hd"','class="hd" text-anchor="start"'))
txt=['結構：[★國考] 3 個甲基 → 1,3,7-trimethylxanthine','兩個環 → pyrimidine × imidazole','[★國考] Murexide test（紫脲酸銨試驗）：',
     '加入兩滴 Ammonium hydroxide，可得紫色殘餘物']
for i,t in enumerate(txt): g.append(f'<text class="tx" x="20" y="{62+i*26}">{t}</text>')
g.append(f'<rect class="box" x="20" y="180" width="230" height="230" rx="12"/>'+place('Caffeine',40,195,190,170,hl_methyl=True)+lab(135,388,'Caffeine'))
tx=270; 
g.append(f'<rect class="box" x="{tx}" y="180" width="520" height="230" rx="12"/>')
g.append(f'<path d="M{tx+260} 180V214M{tx+260} 244V410M{tx} 214H{tx+520}M{tx} 244H{tx+520}" stroke="#E3DDC2" stroke-width="1.5"/>')
g.append(lab(tx+130,197,'Theobromine 可可鹼')+lab(tx+390,197,'Theophylline 茶鹼 [★國考] 4 個 N'))
g.append(lab(tx+260,229,'2 個甲基','sub'))
g.append(place('Theobromine',tx+35,250,190,135,hl_methyl=True)+lab(tx+130,394,'3,7-dimethylxanthine'))
g.append(place('Theophylline',tx+295,250,190,135,hl_methyl=True)+lab(tx+390,394,'1,3-dimethylxanthine'))
open(K+'caffeine-structure.svg','w').write(svg(810,430,''.join(g),'Caffeine'))

# ---------- Coumarin ----------
g=[]; W=170
g.append(f'<text class="hd" x="20" y="26">一、Coumarin：具有 lactone，為 ortho-羥基與其側鏈的羧基環化而成</text>')
xs=[20,230,440,650]
g.append(place('cinnamic',xs[0],50,W,130)+lab(xs[0]+W/2,192,'cinnamic acid'))
g.append(place('o-coumaric',xs[1],50,W,130)+lab(xs[1]+W/2,192,'o-coumaric acid'))
g.append(place('glc-trans',xs[2],50,W,130)+lab(xs[2]+W/2,192,'o-coumaric acid-β-D-Glucoside'))
g.append(arrow(xs[0]+W+2,115,xs[1]-4,115)+lab(xs[0]+W+20,100,'(a)','note'))
g.append(arrow(xs[1]+W+2,115,xs[2]-4,115))
g.append(place('glc-cis',xs[3],50,W,130)+lab(xs[3]+W/2,192,'o-coumaric acid-β-D-Glucoside'))
g.append(f'<path class="arw" d="M{xs[2]+W+4} 108H{xs[3]-6}" marker-end="url(#ar)"/><path class="arw" d="M{xs[3]-6} 122H{xs[2]+W+4}" marker-end="url(#ar)"/>'+lab(xs[2]+W+20,92,'(c) 環化','note'))
g.append(arrow(xs[3]+W/2,206,xs[3]+W/2,236))
g.append(f'<rect class="star" x="{xs[3]}" y="240" width="{W}" height="150" rx="12"/>'+place('coumarin',xs[3]+10,248,W-20,115)+lab(xs[3]+W/2,374,'coumarin'))
g.append(f'<text class="hd" x="20" y="262">二、Coumarin 的衍生物</text>')
g.append(f'<rect class="box" x="20" y="285" width="600" height="250" rx="12"/><path d="M320 285V535M20 318H620M20 350H620" stroke="#E3DDC2" stroke-width="1.5"/>')
g.append(lab(170,302,'Dicumarol')+lab(470,302,'Scopoletin'))
g.append(lab(170,334,'Bishydroxycoumarin','sub')+lab(470,334,'6-Methoxy-7-hydroxycoumarin','sub'))
g.append(place('Dicumarol',40,358,260,170)+place('Scopoletin',360,358,220,170))
open(K+'coumarin-derivatives.svg','w').write(svg(840,550,''.join(g),'Coumarin'))
print('ok')
