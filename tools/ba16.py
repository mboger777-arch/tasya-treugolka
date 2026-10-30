from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
fh=round(560*412/915)
def blk(l):
  a=Image.open(f'sheets/v15/915_{l}.png').convert('RGB');b=Image.open(f'sheets/v16/915_{l}.png').convert('RGB')
  ca=a.crop((0,58,a.width,58+fh));cb=b.crop((0,58,b.width,58+fh))
  R=Image.new('RGB',(ca.width,fh*2+80),(40,24,70));d=ImageDraw.Draw(R)
  d.text((10,6),f'{l}  v15 (до)',fill='#ffd',font=F);R.paste(ca,(0,40));d.text((10,fh+44),f'{l}  v16 (после)',fill='#aff',font=F);R.paste(cb,(0,fh+80));return R
def stack(o):
  S=Image.new('RGB',(o[0].width,sum(x.height for x in o)));y=0
  for x in o:S.paste(x,(0,y));y+=x.height
  return S
allb=[]
for w in range(1,7):
  ls=[f'{w}-1',f'{w}-2'] if w==6 else [f'{w}-1',f'{w}-3']
  bs=[blk(l) for l in ls];allb+=bs
  stack(bs).save(f'sheets/v16/ba_915_w{w}.jpg',quality=85)
S=stack(allb);S=S.resize((S.width*2//3,S.height*2//3));S.save('sheets/before_after_v16_915.png');print(S.size)
