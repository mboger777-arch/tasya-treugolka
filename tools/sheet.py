# листы скриншотов по уровням: python3 tools/sheet.py 844 -> sheets/844_<level>.png
import sys,glob,os,re
from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',28)
w=sys.argv[1];os.makedirs('sheets',exist_ok=True);by={}
for f in sorted(glob.glob(f'shots/{w}_*.png')):
  lv=re.search(r'_\d+_(.+)\.png',f).group(1);by.setdefault(lv,[]).append(f)
for lv,fs in by.items():
  if len(fs)>12:fs=[fs[round(i*(len(fs)-1)/11)] for i in range(12)]
  ims=[Image.open(f) for f in fs];tw=560;th=round(ims[0].height*tw/ims[0].width);cols=3;rows=(len(ims)+cols-1)//cols
  S=Image.new('RGB',(cols*tw+(cols+1)*8,rows*th+(rows+1)*8+50),(40,24,70));d=ImageDraw.Draw(S);d.text((10,10),f'{lv}  {w}px  ({len(fs)} кадров)',fill='white',font=F)
  for i,im in enumerate(ims):S.paste(im.resize((tw,th)),(8+(i%cols)*(tw+8),50+8+(i//cols)*(th+8)))
  S.save(f'sheets/{w}_{lv}.png');print(f'sheets/{w}_{lv}.png')
