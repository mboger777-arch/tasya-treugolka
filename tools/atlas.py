from PIL import Image,ImageDraw
import glob
V='/workspace/lesson59m/v2/cut/'
def sv(src,name,h=None,w=None):
    im=Image.open(src).convert('RGBA')
    if h: im=im.resize((round(im.width*h/im.height),h),Image.LANCZOS)
    elif w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(f'assets/img/{name}.png',optimize=True)
S=340/465
for i,n in enumerate(['idle','blink','jump','fall','hurt']):
    im=Image.open(f'cut/poses_{i}.png');sv(f'cut/poses_{i}.png','t_'+n,h=round(im.height*S))
for i in range(4): sv(f'cut/run_{i}.png',f't_run{i}',h=310)
for i in range(4): sv(V+f'formik_{i}.png',f'fm{i}',h=150)
sv('cut/kit1_0.png','ground',w=512); sv('cut/kit1_1.png','e_wheel',h=150); sv('cut/kit1_2.png','stone',h=260)
sv('cut/kit1_3.png','plank',w=320); sv('cut/kit1_4.png','sign',h=200); sv('cut/kit1_5.png','bush',h=170); sv('cut/kit1_6.png','block',h=128)
sv(V+'wheel_0.png','kuv',h=420)
for i,n in [(1,'heart'),(4,'coin_tri'),(6,'coin_circ'),(8,'star'),(5,'btn_jump'),(7,'btn_form'),(0,'btn_arrow')]: sv(V+f'ui_kit_{i}.png',n,h=160)
for n in ['oskolok_0','oskolok_3','lineup_1','lineup_2','crab_0','owl_0']: sv(V+n+'.png',n,h=400)
Image.open('raw/bg_w1.jpg').convert('RGB').save('assets/img/bg_w1.jpg',quality=85)
Image.open('/workspace/lesson59m/v2/raw/world_map.jpg').convert('RGB').save('assets/img/map.jpg',quality=85)
fs=sorted(glob.glob('assets/img/t_*.png'))+['assets/img/ground.png']
x=0;sheet=Image.new('RGB',(2400,420),(60,60,70))
for f in fs:
    im=Image.open(f);sheet.paste(im,(x,10),im);x+=im.width+8
sheet.save('/tmp/t59_contact2.png')
