using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using UnityEngine;

namespace QTxVideoDirector {
[Serializable] public class Part { public string name,kind,asset; public float[] anchor,size; public int order; }
[Serializable] public class Character { public string id; public Part[] parts; }
[Serializable] public class Actor { public string id; public float[] position; public float scale; public int facing; public Character character; }
[Serializable] public class ActionCue { public string actor,action,targetId; public float start,end; public float[] target; }
[Serializable] public class ContactModule { public string action,character,anchor,replace,asset; public float[] size,pivot; public int order; }
[Serializable] public class InteractionCue { public string actor; public float start,end; public ContactModule module; }
public class Pose {
 public Vector2 root; public int facing; public float headAngle,headFacing=1;
 public float armLeft=-10,armRight=10,elbowLeft=8,elbowRight=8,legLeft=-3,legRight=3,kneeLeft,kneeRight;
 public InteractionCue contact;
}

// Compiles only the four supported actions. Evaluation never reads a prior frame.
public sealed class SemanticTimeline {
 readonly Shot shot;
 readonly Dictionary<string,ActionCue[]> actions = new Dictionary<string,ActionCue[]>();
 public SemanticTimeline(Shot source) {
  shot=source; shot.actors=shot.actors??new Actor[0]; shot.actions=shot.actions??new ActionCue[0]; shot.interactions=shot.interactions??new InteractionCue[0];
  var ids=new HashSet<string>(shot.objects.Select(o=>o.id));
  foreach(var a in shot.actors) {
   if(!ids.Add(a.id))throw new Exception("Duplicate actor id "+a.id);
   string[] required={"torso","head","arm_left","arm_right","leg_left","leg_right"};
   if(a.character==null || required.Any(n=>a.character.parts.Count(p=>p.name==n)!=1))throw new Exception("Missing required semantic part");
   actions[a.id]=shot.actions.Where(c=>c.actor==a.id).OrderBy(c=>c.start).ToArray();
  }
  foreach(var c in shot.actions) {
   if(!actions.ContainsKey(c.actor) || !new[]{"IDLE","WALK_TO","LOOK_AT","POINT_AT"}.Contains(c.action))throw new Exception("Unknown actor/action");
   CheckRange(c.start,c.end);
   if(!string.IsNullOrEmpty(c.targetId) && (!ids.Contains(c.targetId)||c.targetId==c.actor||c.action=="WALK_TO"))throw new Exception("Unknown/unsupported target");
  }
  foreach(var c in shot.interactions) {
   CheckRange(c.start,c.end);
   var a=shot.actors.SingleOrDefault(x=>x.id==c.actor);
   if(a==null || c.module==null || c.module.action!="HOLD_CARD" || c.module.character!=a.character.id || c.module.anchor!="arm_right" || c.module.replace!="arm_right")throw new Exception("Incompatible interaction");
  }
  foreach(var a in shot.actors) {
   var channels=shot.actions.Where(c=>c.actor==a.id).Select(c=>(start:c.start,end:c.end,head:c.action=="LOOK_AT"))
    .Concat(shot.interactions.Where(c=>c.actor==a.id).Select(c=>(start:c.start,end:c.end,head:false))).ToArray();
   for(int i=0;i<channels.Length;i++)for(int j=i+1;j<channels.Length;j++)
    if(channels[i].head==channels[j].head && channels[i].start<channels[j].end && channels[j].start<channels[i].end)throw new Exception("Conflicting actor actions");
  }
 }
 void CheckRange(float start,float end) { if(float.IsNaN(start)||float.IsNaN(end)||start<0||end<=start||end>shot.duration)throw new Exception("Invalid action time range"); }
 public static Vector2 V(float[] p) { return new Vector2(p[0],p[1]); }
 public Vector2 Root(Actor a,double t) {
  var p=V(a.position);
  foreach(var c in actions[a.id])if(c.action=="WALK_TO" && t>=c.start) p=Vector2.Lerp(p,V(c.target),Mathf.Clamp01((float)((t-c.start)/(c.end-c.start))));
  return p;
 }
 public Vector2 Target(ActionCue cue,double t) {
  if(string.IsNullOrEmpty(cue.targetId))return V(cue.target);
  var actor=shot.actors.FirstOrDefault(a=>a.id==cue.targetId);
  if(actor!=null)return Root(actor,t);
  var item=shot.objects.Single(o=>o.id==cue.targetId);
  return new Vector2(BatchRender.Evaluate(item.x,t),BatchRender.Evaluate(item.y,t));
 }
 public Pose Evaluate(Actor a,double t) {
  var p=new Pose{root=Root(a,t),facing=a.facing};
  foreach(var c in actions[a.id]) {
   if(c.action=="WALK_TO" && t>=c.start) {
    float dx=V(c.target).x-Root(a,c.start).x;
    if(Mathf.Abs(dx)>0.001f)p.facing=dx>0?1:-1;
   }
  }
  foreach(var c in actions[a.id]) {
   if(t<c.start || t>=c.end)continue;
   if(c.action=="WALK_TO") {
    float phase=(float)((t-c.start)*Math.PI*2*1.5),s=Mathf.Sin(phase);
    // Authored repeating gait, eased at range boundaries; no physics/foot solver.
    float envelope=Mathf.Min(1,Mathf.Min((float)(t-c.start)*6,(float)(c.end-t)*6));
    p.legLeft=32*s*envelope; p.legRight=-32*s*envelope;
    p.kneeLeft=38*Mathf.Max(0,-s)*envelope; p.kneeRight=38*Mathf.Max(0,s)*envelope;
    p.armLeft=-22*s*envelope;p.armRight=22*s*envelope;
   }
   if(c.action=="POINT_AT") {
    var anchor=V(a.character.parts.Single(x=>x.name=="arm_right").anchor);
    var local=(Target(c,t)-p.root)/a.scale;local.x*=p.facing;
    var d=local-anchor;
    float angle=Mathf.Atan2(d.x,-d.y)*Mathf.Rad2Deg;
    p.armRight=angle-10; p.elbowRight=20;
   }
   if(c.action=="LOOK_AT") {
    var head=V(a.character.parts.Single(x=>x.name=="head").anchor);
    var local=(Target(c,t)-p.root)/a.scale;local.x*=p.facing;
    var d=local-head;
    p.headFacing=d.x<0?-1:1;
    p.headAngle=Mathf.Clamp(Mathf.Atan2(d.y,Mathf.Abs(d.x))*Mathf.Rad2Deg,-25,25)*p.headFacing;
   }
  }
  p.contact=shot.interactions.FirstOrDefault(c=>c.actor==a.id && t>=c.start && t<c.end);
  return p;
 }
}

// A connected 24-row strip with smooth two-bone linear blend skinning.
// Bind pose points down; the second bone's bind origin is at half length.
public sealed class LimbMesh {
 public readonly Mesh mesh;
 readonly Vector3[] bind,vertices;
 readonly float[] weights;
 readonly float half;
 public LimbMesh(float width,float length) {
  half=length/2; const int rows=24;
  bind=new Vector3[(rows+1)*2];vertices=new Vector3[bind.Length];weights=new float[bind.Length];
  var uv=new Vector2[bind.Length];var triangles=new int[rows*6];
  for(int row=0;row<=rows;row++)for(int side=0;side<2;side++) {
   int i=row*2+side;float u=(float)row/rows;
   bind[i]=new Vector3((side-0.5f)*width,-u*length,0);uv[i]=new Vector2(side,1-u);
   weights[i]=Mathf.SmoothStep(0,1,Mathf.InverseLerp(0.3f,0.7f,u));
  }
  for(int r=0;r<rows;r++){int i=r*2,k=r*6;triangles[k]=i;triangles[k+1]=i+2;triangles[k+2]=i+1;triangles[k+3]=i+1;triangles[k+4]=i+2;triangles[k+5]=i+3;}
  mesh=new Mesh{name="QTx continuous two-bone limb"};mesh.vertices=bind;mesh.uv=uv;mesh.triangles=triangles;
  mesh.colors=Enumerable.Repeat(Color.white,bind.Length).ToArray();
 }
 public static Vector3 Rotate(Vector3 p,float angle) { return Quaternion.Euler(0,0,angle)*p; }
 public void Skin(float upper,float bend) {
  var joint=Rotate(new Vector3(0,-half,0),upper);
  for(int i=0;i<bind.Length;i++) {
   var proximal=Rotate(bind[i],upper);
   var distal=joint+Rotate(bind[i]+new Vector3(0,half,0),upper+bend);
   vertices[i]=Vector3.LerpUnclamped(proximal,distal,weights[i]);
  }
  mesh.vertices=vertices;mesh.RecalculateBounds();
 }
}

public sealed class SemanticActors : IDisposable {
 sealed class Visual { public GameObject go; public SpriteRenderer sprite; public LimbMesh limb; }
 sealed class Instance { public Actor actor; public GameObject root; public Dictionary<string,Visual> parts=new Dictionary<string,Visual>(); public Dictionary<InteractionCue,Visual> contacts=new Dictionary<InteractionCue,Visual>(); }
 readonly SemanticTimeline timeline;
 readonly List<Instance> instances=new List<Instance>();
 readonly List<UnityEngine.Object> resources=new List<UnityEngine.Object>();
 public SemanticActors(Shot shot,Material material) {
  timeline=new SemanticTimeline(shot);
  foreach(var actor in shot.actors) {
   var instance=new Instance{actor=actor,root=new GameObject(actor.id)};instances.Add(instance);
   foreach(var part in actor.character.parts)instance.parts.Add(part.name,Create(instance.root,part.name,part.asset,part.anchor,part.size,part.order,part.kind=="limb",new float[]{0.5f,0.5f},material));
   foreach(var cue in shot.interactions.Where(c=>c.actor==actor.id)) {
    var anchor=actor.character.parts.Single(p=>p.name==cue.module.anchor).anchor;
    instance.contacts.Add(cue,Create(instance.root,"HOLD_CARD",cue.module.asset,anchor,cue.module.size,cue.module.order,false,cue.module.pivot,material));
   }
  }
 }
 Visual Create(GameObject parent,string name,string asset,float[] anchor,float[] size,int order,bool limb,float[] pivot,Material material) {
  var tex=new Texture2D(2,2,TextureFormat.RGBA32,false);resources.Add(tex);
  if(!ImageConversion.LoadImage(tex,File.ReadAllBytes(asset)))throw new Exception("Cannot decode module "+asset);
  tex.filterMode=FilterMode.Bilinear;tex.wrapMode=TextureWrapMode.Clamp;
  var v=new Visual{go=new GameObject(name)};v.go.transform.SetParent(parent.transform,false);v.go.transform.localPosition=SemanticTimeline.V(anchor);
  if(limb) {
   v.limb=new LimbMesh(size[0],size[1]);resources.Add(v.limb.mesh);
   v.go.AddComponent<MeshFilter>().sharedMesh=v.limb.mesh;
   var renderer=v.go.AddComponent<MeshRenderer>();var mat=new Material(material);mat.mainTexture=tex;resources.Add(mat);renderer.sharedMaterial=mat;renderer.sortingOrder=order;
  } else {
   var sprite=Sprite.Create(tex,new Rect(0,0,tex.width,tex.height),SemanticTimeline.V(pivot),100,0,SpriteMeshType.FullRect);resources.Add(sprite);
   v.sprite=v.go.AddComponent<SpriteRenderer>();v.sprite.sprite=sprite;v.sprite.sharedMaterial=material;v.sprite.sortingOrder=order;
   v.go.transform.localScale=new Vector3(size[0]*100/tex.width,size[1]*100/tex.height,1);
  }
  return v;
 }
 public void Evaluate(double time) {
  foreach(var i in instances) {
   var p=timeline.Evaluate(i.actor,time);i.root.transform.position=p.root;i.root.transform.localScale=new Vector3(i.actor.scale*p.facing,i.actor.scale,1);
   i.parts["arm_left"].limb.Skin(p.armLeft,p.elbowLeft);i.parts["arm_right"].limb.Skin(p.armRight,p.elbowRight);
   i.parts["leg_left"].limb.Skin(p.legLeft,p.kneeLeft);i.parts["leg_right"].limb.Skin(p.legRight,p.kneeRight);
   var head=i.parts["head"];head.go.transform.localRotation=Quaternion.Euler(0,0,p.headAngle);head.sprite.flipX=p.headFacing<0;
   i.parts["arm_right"].go.SetActive(p.contact==null);
   foreach(var contact in i.contacts)contact.Value.go.SetActive(contact.Key==p.contact);
  }
 }
 public void Dispose() {
  foreach(var i in instances)UnityEngine.Object.DestroyImmediate(i.root);
  foreach(var resource in resources)UnityEngine.Object.DestroyImmediate(resource);
 }
}
}
