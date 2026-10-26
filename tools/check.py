from rdkit import Chem
from rdkit.Chem.rdMolDescriptors import CalcMolFormula as F
S={
'Tyrosine':'N[C@@H](Cc1ccc(O)cc1)C(=O)O','L-Dopa':'N[C@@H](Cc1ccc(O)c(O)c1)C(=O)O','Dopamine':'NCCc1ccc(O)c(O)c1',
'pHPAA':'O=CCc1ccc(O)cc1','Norcoclaurine':'Oc1ccc(C[C@@H]2NCCc3cc(O)c(O)cc32)cc1',
'Coclaurine':'COc1cc2CCN[C@@H](Cc3ccc(O)cc3)c2cc1O','S-Reticuline':'COc1ccc(C[C@H]2N(C)CCc3cc(OC)c(O)cc32)cc1O',
'Dehydroreticuline':'COc1ccc(CC2=[N+](C)CCc3cc(OC)c(O)cc32)cc1O','R-Reticuline':'COc1ccc(C[C@@H]2N(C)CCc3cc(OC)c(O)cc32)cc1O',
'Salutaridine':'CN1CC[C@]23C=C(OC)C(=O)C=C2[C@H]1Cc1ccc(OC)c(O)c13',
'Thebaine':'COC1=CC=C2[C@H]3Cc4ccc(OC)c5O[C@@H]1[C@]2(CCN3C)c45',
'Codeinone':'CN1CC[C@]23[C@@H]4Oc5c3c(C[C@@H]1[C@@H]2C=CC4=O)ccc5OC',
'Codeine':'CN1CC[C@]23[C@@H]4Oc5c3c(C[C@@H]1[C@@H]2C=C[C@@H]4O)ccc5OC',
'Morphine':'CN1CC[C@]23[C@@H]4Oc5c3c(C[C@@H]1[C@@H]2C=C[C@@H]4O)ccc5O',
'Caffeine':'Cn1cnc2c1c(=O)n(C)c(=O)n2C','Theobromine':'Cn1cnc2c1c(=O)[nH]c(=O)n2C','Theophylline':'Cn1c(=O)c2[nH]cnc2n(C)c1=O',
'cinnamic':'OC(=O)/C=C/c1ccccc1','o-coumaric':'OC(=O)/C=C/c1ccccc1O','coumarin':'O=c1ccc2ccccc2o1',
'Dicumarol':'O=c1oc2ccccc2c(O)c1Cc1c(O)c2ccccc2oc1=O','Scopoletin':'COc1cc2ccc(=O)oc2cc1O'}
for k,v in S.items():
  m=Chem.MolFromSmiles(v); print(k,F(m) if m else 'BAD')
