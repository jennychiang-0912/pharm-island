# 醣類、配醣體講義的結構圖：結構式用 RDKit 由 SMILES 產生，版面照講義（表格、方框）重畫
import os, re
from rdkit import Chem
from rdkit.Chem import rdDepictor, rdCoordGen
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
K = os.path.join(os.path.dirname(__file__), '..', 'assets', 'knowledge') + '/'
FONT = 'PingFang TC, Microsoft JhengHei, Noto Sans TC, Heiti TC, sans-serif'
STYLE = f'''<style>text{{font-family:{FONT};dominant-baseline:central}} .lab{{font-size:13px;font-weight:700;fill:#24372C;text-anchor:middle}}
.hd{{font-size:14px;font-weight:800;fill:#315B43;text-anchor:middle}} .tx{{font-size:12.5px;font-weight:600;fill:#24372C}} .key{{font-size:12px;font-weight:700;fill:#B4533F}}
.sub{{font-size:12px;font-weight:700;fill:#B4533F;text-anchor:middle}} .arw{{stroke:#315B43;stroke-width:2.2;fill:none}}
.box{{fill:#fff;stroke:#D8D0B4;stroke-width:1.5}} .hdbg{{fill:#EBE5CC}} .grid{{stroke:#D8D0B4;stroke-width:1.5;fill:none}} .dash{{fill:none;stroke:#9C8F57;stroke-width:1.4;stroke-dasharray:5 4}}</style>
<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M0 0L10 5L0 10z" fill="#315B43"/></marker></defs>'''
def svg(w, h, inner, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><!-- {title}：依講義印刷內容重畫，結構式用 RDKit 產生 -->{STYLE}<rect width="{w}" height="{h}" fill="#FFFFFF"/>{inner}</svg>'
def mol(smi, w, h, labels=None, notes=None, coordgen=True):
    m = Chem.MolFromSmiles(smi)
    for a in m.GetAtoms():
        mp = a.GetAtomMapNum()
        if labels and mp in labels: a.SetProp('atomLabel', labels[mp]); a.SetAtomMapNum(0)
        elif notes and mp in notes: a.SetProp('atomNote', notes[mp]); a.SetAtomMapNum(0)
    (rdCoordGen.AddCoords if coordgen else rdDepictor.Compute2DCoords)(m)
    d = rdMolDraw2D.MolDraw2DSVG(w, h); o = d.drawOptions()
    o.clearBackground = False; o.bondLineWidth = 1.6; o.minFontSize = 11; o.maxFontSize = 13; o.annotationFontScale = 0.75
    o.padding = 0.1; o.addStereoAnnotation = False; o.useBWAtomPalette()
    d.DrawMolecule(m); d.FinishDrawing()
    body = re.sub(r'^.*?<svg[^>]*>', '', d.GetDrawingText(), flags=re.S).replace('</svg>', '')
    return body, m
def place(smi, x, y, w, h, **k):
    body, m = mol(smi, w, h, **k)
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'
def t(x, y, s, cls='lab', anchor=None):
    a = f' style="text-anchor:{anchor}"' if anchor else ''
    return f'<text class="{cls}"{a} x="{x}" y="{y}">{s}</text>'

# ---------- 強心配醣體：結構[★國考] ----------
# 類固醇骨架（5β、14β，C-3 接醣、C-14 接 OH、C-17 接 R），標出 3／14／17 號位置
core = 'C[C@]12CC[C@H](O[*:91])C[C@H]1CC[C@@H]1[C@@H]2CC[C@]2(C)[C@H]([*:92])CC[C@]12O'
core = core.replace('C[C@H](O[*:91])', '[CH2:0]X').replace('[CH2:0]X', 'C[C@H:3](O[*:91])')
core = 'CC12CC[CH:3](O[*:91])CC1CCC1C2CCC2(C)[CH:17]([*:92])CC[C:14]12O'   # 只畫骨架（不畫立體的 H，避免和 OH 疊在一起）
g = []
g.append('<rect class="dash" x="200" y="20" width="420" height="300" rx="12"/>' + t(410, 40, '★非醣基★', 'key', 'middle'))
g.append(place(core, 220, 50, 380, 260, labels={91: 'Sugar', 92: 'R'}, notes={3: '3', 14: '14', 17: '17'}))
g.append('<rect class="box" x="20" y="120" width="160" height="96" rx="10"/>' + t(100, 144, '★醣基★', 'key', 'middle'))
g.append(t(100, 172, '接在類固醇的', 'tx', 'middle') + t(100, 192, '3 號位置上', 'tx', 'middle'))
g.append('<rect class="box" x="640" y="20" width="250" height="300" rx="12"/>')
g.append(t(765, 44, '17 號位置可依所接的', 'tx', 'middle') + t(765, 64, '取代基分為兩種：', 'tx', 'middle'))
g.append(t(765, 92, 'Cardenolide', 'hd') + place('[*:1]C1=CC(=O)OC1', 690, 102, 150, 80, labels={1: 'R'}))
g.append(t(765, 206, 'Bufadienolide', 'hd') + place('[*:1]C1=COC(=O)C=C1', 690, 216, 150, 90, labels={1: 'R'}))
open(K + 'cardiac-structure.svg', 'w').write(svg(910, 340, ''.join(g), '強心配醣體：結構'))

# ---------- 皂苷類：合成與代謝 ----------
g = []
g.append(t(60, 100, 'Acetate') + '<path class="arw" d="M100 100H150" marker-end="url(#ar)"/>')
g.append(t(210, 100, 'Mevalonate') + '<path class="arw" d="M268 100H318" marker-end="url(#ar)"/>')
g.append(t(370, 100, 'squalene') + '<path d="M335 112H405" stroke="#24372C" stroke-width="1.4"/>')
g.append('<path class="arw" d="M420 92L470 56" marker-end="url(#ar)"/><path class="arw" d="M420 108L470 144" marker-end="url(#ar)"/>')
g.append('<rect class="box" x="478" y="22" width="232" height="64" rx="8"/>' + t(594, 44, 'Spiroketal steroid nucleus') + t(594, 66, '（Diogenin）'))
g.append('<rect class="box" x="478" y="114" width="232" height="64" rx="8"/>' + t(594, 136, 'Pentacyclic triterpenoid') + t(594, 158, '（β-amyrin）'))
open(K + 'saponin-pathway.svg', 'w').write(svg(730, 200, ''.join(g), '皂苷類：合成與代謝'))

# ---------- 蒽醌類：結構 ----------
g = []
# 表一：非醣基｜蒽類｜蒽醌類
x0, y0, W1, W2, W3, H1, H2 = 20, 20, 120, 230, 330, 64, 180
X = [x0, x0 + W1, x0 + W1 + W2, x0 + W1 + W2 + W3]
g.append(f'<rect class="hdbg" x="{x0}" y="{y0}" width="{X[3]-x0}" height="{H1}"/><rect class="grid" x="{x0}" y="{y0}" width="{X[3]-x0}" height="{H1+H2}"/>')
g.append(f'<path class="grid" d="M{X[1]} {y0}V{y0+H1+H2}M{X[2]} {y0}V{y0+H1+H2}M{x0} {y0+H1}H{X[3]}"/>')
g.append(t((X[0]+X[1])/2, y0+H1/2, '非醣基') + t((X[1]+X[2])/2, y0+H1/2, '蒽類（Anthracene）'))
g.append(t((X[2]+X[3])/2, y0+22, '蒽醌類（Anthraquinone）') + t((X[2]+X[3])/2, y0+44, '又稱 Dioxoanthracene 或 Anthracenedione', 'tx', 'middle'))
g.append(t((X[0]+X[1])/2, y0+H1+H2/2, '結構特徵'))
g.append(place('c1ccc2cc3ccccc3cc2c1', X[1]+15, y0+H1+8, W2-30, 120))
g.append(t((X[1]+X[2])/2, y0+H1+150, '✓ 三個相連的苯環結構（蒽）', 'tx', 'middle'))
g.append(place('O=C1c2ccccc2C(=O)c2ccccc21', X[2]+40, y0+H1+8, W3-80, 164))
# 表二：還原態 V.S. 氧化態
y1 = y0 + H1 + H2 + 50
g.append(t(x0, y1 - 22, '★第 3 碳上甲基之氧化生合成：[★國考]', 'hd', 'start'))
C = [x0, x0 + 200, x0 + 270, x0 + 370, x0 + 450, x0 + 700]; RH = 44
rows = [('1. 大黃酚（Chrysophanol）', 'H', 'CH₃'), ('2. 大黃素（Emodin）', 'OH', 'CH₃'), ('3. 蘆薈大黃素（Aloe-emodin）', 'H', 'CH₂OH'), ('4. 大黃酸（Rhein）', 'H', 'COOH')]
Hh = 40; Ht = Hh + RH * len(rows)
g.append(f'<rect class="hdbg" x="{C[0]}" y="{y1}" width="{C[5]-C[0]}" height="{Hh}"/><rect class="grid" x="{C[0]}" y="{y1}" width="{C[5]-C[0]}" height="{Ht}"/>')
g.append('<path class="grid" d="' + ''.join(f'M{c} {y1}V{y1+Ht}' for c in C[1:5]) + f'M{C[0]} {y1+Hh}H{C[5]}' + ''.join(f'M{C[0]} {y1+Hh+RH*i}H{C[3]}' for i in range(1, len(rows))) + '"/>')
for i, h in enumerate(['還原態 V.S. 氧化態', 'R₁', 'R₂', '還原氧化過程', '骨架']):
    g.append(t((C[i]+C[i+1])/2, y1+Hh/2, h))
for i, (n, r1, r2) in enumerate(rows):
    yy = y1 + Hh + RH * i + RH / 2
    g.append(t(C[0]+10, yy, n, 'tx', 'start') + t((C[1]+C[2])/2, yy, r1) + t((C[2]+C[3])/2, yy, r2))
g.append(f'<path class="arw" d="M{(C[3]+C[4])/2-14} {y1+Hh+16}V{y1+Ht-14}" marker-end="url(#ar)"/>' + t((C[3]+C[4])/2+16, y1+Hh+RH*2, '氧化', 'sub'))
g.append(place('O=C1c2c(O)cc([*:1])cc2C(=O)c2cc([*:2])cc(O)c21', C[4]+8, y1+Hh+4, C[5]-C[4]-16, Ht-Hh-8, labels={1: 'R<sub>2</sub>', 2: 'R<sub>1</sub>'}))   # 照講義：R₁ 在左、R₂ 在右
H = y1 + Ht + 20
open(K + 'anthraquinone-structures.svg', 'w').write(svg(X[3] + 20 if X[3] > C[5] else C[5] + 20, H, ''.join(g), '蒽醌類：結構'))

for n, s in [('digitoxigenin-core', core.replace('[*:91]', 'C').replace('[*:92]', 'C')), ('anthracene', 'c1ccc2cc3ccccc3cc2c1'), ('anthraquinone', 'O=C1c2ccccc2C(=O)c2ccccc21'), ('chrysophanol', 'O=C1c2c(O)cc(C)cc2C(=O)c2cccc(O)c21')]:
    m = Chem.MolFromSmiles(re.sub(r':\d+\]', ']', s)); print(n, CalcMolFormula(m))
print('ok')
