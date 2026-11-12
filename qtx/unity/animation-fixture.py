"""Local synthetic P04 artwork; only writes NEW episode-local asset directories.
Initialize Series/episode with production.mjs first, inspect shared/, then explicitly
promote these technical fixtures. Requires Pillow; never calls a provider.
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw

episode = Path(sys.argv[1]).resolve()
generated = episode / 'assets/generated'
host = generated / 'technical-host'
contact = generated / 'hold-card'
for output in [host, contact, episode/'unity-project.json', episode/'scenes/semantic.json', generated/'cpu.png']:
    if output.exists():
        raise FileExistsError(f'Refusing to replace existing fixture: {output}')
host.mkdir(parents=True, exist_ok=False)
contact.mkdir(parents=True, exist_ok=False)

def write(p, data):
    p.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')

ink = '#203A50'
skin = '#F5BD8D'
shirt = '#278D9C'

def raster(p, size, draw):
    # Simple hand-authored raster source; no generated Unity asset copies.
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    draw(ImageDraw.Draw(im))
    im.save(p)

raster(host/'torso.png', (120,150), lambda d: d.rounded_rectangle((3,3,117,147),radius=26,fill=shirt,outline=ink,width=5))
def head(d):
    d.ellipse((5,5,115,115),fill=skin,outline=ink,width=5)
    d.pieslice((5,0,115,80),180,355,fill=ink)
    d.ellipse((80,48,90,60),fill=ink)
    d.arc((65,58,100,89),5,100,fill=ink,width=4)
raster(host/'head.png',(120,120),head)
for name,color in [('arm',skin),('leg','#3B627C')]:
    raster(host/(name+'.png'),(40,180),lambda d,c=color: d.rounded_rectangle((3,0,37,179),radius=15,fill=c,outline=ink,width=3))

parts=[]
for name,asset,anchor,size,order,kind in [
    ('torso','torso.png',[0,1.9],[1.15,1.5],20,'sprite'),
    ('head','head.png',[0,3.05],[1.15,1.15],30,'sprite'),
    ('arm_left','arm.png',[-.43,2.48],[.32,1.65],10,'limb'),
    ('arm_right','arm.png',[.43,2.48],[.32,1.65],40,'limb'),
    ('leg_left','leg.png',[-.3,1.28],[.39,1.55],11,'limb'),
    ('leg_right','leg.png',[.3,1.28],[.39,1.55],12,'limb')]:
    parts.append(dict(name=name,asset=asset,anchor=anchor,size=size,order=order,kind=kind))
write(host/'character.json',dict(schema='qtx-character-v1',id='technical-host',scale=1,parts=parts))

# ONE authored contact image: whole bent arm, palm behind card, thumb on front.
# Shoulder pixel (30,30) maps exactly onto character arm_right anchor.
def hold(d):
    d.line([(30,30),(52,115),(123,113)],fill=ink,width=33)
    d.line([(30,30),(52,115),(123,113)],fill=skin,width=25)
    for x,y in [(30,30),(52,115),(123,113)]:
        d.ellipse((x-12,y-12,x+12,y+12),fill=skin)
    d.rounded_rectangle((104,51,240,144),radius=5,fill='#FFFCED',outline=ink,width=4)
    d.rounded_rectangle((104,100,125,123),radius=8,fill=skin,outline=ink,width=3)
raster(contact/'hold-card.png',(260,180),hold)
write(contact/'interaction.json',dict(schema='qtx-interaction-v1',action='HOLD_CARD',character='technical-host',anchor='arm_right',replace='arm_right',asset='hold-card.png',size=[2.6,1.8],pivot=[30/260,1-30/180]))

raster(generated/'cpu.png',(140,120),lambda d: (d.rounded_rectangle((5,5,135,115),radius=12,fill='#E7B847',outline=ink,width=5),d.rectangle((30,30,110,90),fill=ink),d.text((58,52),'CPU',fill='white')))
write(episode/'unity-project.json',dict(schema='qtx-unity-v1',width=640,height=360,fps=12,scenes=['scenes/semantic.json']))
write(episode/'scenes/semantic.json',dict(duration=10,background='#F5F1E8',objects=[dict(id='cpu',type='sprite',asset='../assets/generated/cpu.png',position=[3,2],order=5)],actors=[dict(id='host',character='../../../shared/characters/technical-host/character.json',position=[-5,-2],scale=1)],actions=[dict(actor='host',action='WALK_TO',start=0,end=2,target=[-1.5,-2]),dict(actor='host',action='LOOK_AT',start=2,end=5,target='cpu'),dict(actor='host',action='POINT_AT',start=3,end=5,target='cpu'),dict(actor='host',action='IDLE',start=8,end=10)],interactions=[dict(actor='host',start=5,end=8,module='../../../shared/interactions/hold-card/interaction.json')]))
print(episode)
