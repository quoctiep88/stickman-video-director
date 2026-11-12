using System;
using System.Linq;
using UnityEngine;
namespace QTxVideoDirector {
// Small batch self-test of real evaluation, no duplicated JS animation implementation.
public static class SemanticAnimationTests {
 static void Check(bool value,string message) { if(!value)throw new Exception("Semantic test: "+message); }
 public static void Run() {
  var names=new[]{"torso","head","arm_left","arm_right","leg_left","leg_right"};
  var a=new Actor{id="host",position=new float[]{0,0},scale=1,facing=1,character=new Character{id="test",parts=names.Select(n=>new Part{name=n,anchor=new float[]{0,0}}).ToArray()}};
  var walk=new ActionCue{actor="host",action="WALK_TO",start=0,end=2,target=new float[]{4,0}};
  var point=new ActionCue{actor="host",action="POINT_AT",start=2,end=4,targetId="cpu"};
  var hold=new InteractionCue{actor="host",start=4,end=6,module=new ContactModule{action="HOLD_CARD",character="test",anchor="arm_right",replace="arm_right"}};
  var shot=new Shot{duration=8,actors=new[]{a},actions=new[]{walk,point},interactions=new[]{hold},objects=new[]{new Item{id="cpu",x=new[]{new Key{time=0,value=8}},y=new[]{new Key{time=0,value=0}}}}};
  var timeline=new SemanticTimeline(shot);
  Check(timeline.Root(a,1)==new Vector2(2,0) && timeline.Root(a,7)==new Vector2(4,0),"linear root / hold");
  var nextWalk=new ActionCue{actor="host",action="WALK_TO",start=6,end=8,target=new float[]{0,0}};
  shot.actions=new[]{walk,point,nextWalk};timeline=new SemanticTimeline(shot);
  Check(timeline.Root(a,7)==new Vector2(2,0) && timeline.Evaluate(a,7).facing==-1,"chained root travel and facing");
  shot.actions=new[]{walk,point};timeline=new SemanticTimeline(shot);
  var p=timeline.Evaluate(a,0.5);timeline.Evaluate(a,7);var repeat=timeline.Evaluate(a,0.5);
  Check(p.legLeft==repeat.legLeft && p.root==repeat.root && Math.Abs(p.legLeft)>20 && p.legLeft*p.legRight<0,"deterministic animated gait / out-of-order evaluation");
  p=timeline.Evaluate(a,3);
  var tip=LimbMesh.Rotate(Vector3.down,p.armRight)+LimbMesh.Rotate(Vector3.down,p.armRight+p.elbowRight);
  Check(tip.x>1.9f && Math.Abs(tip.y)<0.001f,"named POINT_AT direction");
  point.targetId=null;point.target=new float[]{4,4};p=timeline.Evaluate(a,3);
  tip=LimbMesh.Rotate(Vector3.down,p.armRight)+LimbMesh.Rotate(Vector3.down,p.armRight+p.elbowRight);
  Check(tip.y>1.9f && Math.Abs(tip.x)<0.001f,"position POINT_AT direction");
  Check(timeline.Evaluate(a,4).contact==hold && timeline.Evaluate(a,6).contact==null,"contact activation/replacement boundary");
  var other=new Actor{id="other",position=new float[]{-2,3},scale=1,facing=1,character=a.character};
  shot.actors=new[]{a,other};point.targetId="other";timeline=new SemanticTimeline(shot);
  Check(timeline.Target(point,3)==new Vector2(-2,3),"actor target resolution");
  var look=new ActionCue{actor="host",action="LOOK_AT",start=2,end=4,target=new float[]{-2,3}};
  shot.actions=new[]{walk,point,look};timeline=new SemanticTimeline(shot);
  Check(timeline.Evaluate(a,3).headFacing==-1 && timeline.Evaluate(a,3).headAngle<0,"LOOK_AT orientation");
  var limb=new LimbMesh(.3f,2);limb.Skin(25,40);var vertices=limb.mesh.vertices;limb.Skin(-30,10);limb.Skin(25,40);
  Check(vertices.SequenceEqual(limb.mesh.vertices) && vertices.Length==50 && limb.mesh.triangles.Length==144,"connected skin and deterministic vertices");
  UnityEngine.Object.DestroyImmediate(limb.mesh);
  point.action="UNKNOWN";bool rejected=false;try{new SemanticTimeline(shot);}catch(Exception){rejected=true;}
  Check(rejected,"unknown action rejected by Unity");
  Debug.Log("QTX semantic self-tests PASS: root, gait, targets, point direction, look, contact, skin, rejection");
 }
 public static void CheckContacts(Shot shot,SemanticActors actors) {
  foreach(var cue in shot.interactions) {
   actors.Evaluate(cue.start);
   var root=GameObject.Find(cue.actor).transform;
   Check(!root.Find(cue.module.replace).gameObject.activeSelf,"ordinary limb hidden during contact");
   Check(root.Cast<Transform>().Any(t=>t.name=="HOLD_CARD" && t.gameObject.activeSelf),"authored contact visible");
   actors.Evaluate(cue.end);
   if(!shot.interactions.Any(c=>c.actor==cue.actor && c.start<=cue.end && cue.end<c.end))
    Check(root.Find(cue.module.replace).gameObject.activeSelf && !root.Cast<Transform>().Any(t=>t.name=="HOLD_CARD" && t.gameObject.activeSelf),"normal limb restored after contact");
  }
  if(shot.interactions.Length>0)Debug.Log("QTX contact rendering activation/replacement self-test PASS");
 }
}
}
