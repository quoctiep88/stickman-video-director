using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;

namespace QTxVideoDirector {
[Serializable] public class Key { public float time, value; }
[Serializable] public class Item {
 public string id, asset;
 public Key[] x,y,sx,sy,rotation,opacity,order;
}
[Serializable] public class Shot { public int frames; public float duration; public string background; public Item[] objects; public Actor[] actors; public ActionCue[] actions; public InteractionCue[] interactions; }
[Serializable] public class Job { public int width,height,fps,totalFrames; public string output; public Shot[] scenes; }
[Serializable] public class Result { public string version; }
public static class BatchRender {
 public static float Evaluate(Key[] keys, double time) {
  if(time<=keys[0].time)return keys[0].value;
  for(int i=1;i<keys.Length;i++)if(time<=keys[i].time)
   return Mathf.LerpUnclamped(keys[i-1].value,keys[i].value,(float)((time-keys[i-1].time)/(keys[i].time-keys[i-1].time)));
  return keys[keys.Length-1].value;
 }
 static void SelfTest() {
  var keys=new[]{new Key{time=0,value=-4},new Key{time=3,value=4}};
  if(Evaluate(keys,0)!=-4 || Evaluate(keys,1.5)!=0 || Evaluate(keys,3)!=4 || Evaluate(keys,4)!=4)
   throw new Exception("Linear interpolation self-test failed");
  Debug.Log("QTX interpolation self-test PASS");
 }
 public static void Run() {
  try {
   SelfTest();
   SemanticAnimationTests.Run();
   string[] args=Environment.GetCommandLineArgs();int index=Array.IndexOf(args,"-qtxJob");
   if(index<0 || index+1>=args.Length)throw new Exception("-qtxJob required (use Node bridge)");
   var job=JsonUtility.FromJson<Job>(File.ReadAllText(args[index+1]));
   EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
   QualitySettings.antiAliasing=0;
   var cameraObject=new GameObject("QTx Camera");
   var camera=cameraObject.AddComponent<Camera>();
   camera.orthographic=true;camera.orthographicSize=4.5f;
   camera.transform.position=new Vector3(0,0,-10);
   camera.clearFlags=CameraClearFlags.SolidColor;camera.allowHDR=false;camera.allowMSAA=false;
   camera.nearClipPlane=0.1f;camera.farClipPlane=100;
   var target=new RenderTexture(job.width,job.height,24,RenderTextureFormat.ARGB32,RenderTextureReadWrite.sRGB);
   target.antiAliasing=1;target.Create();camera.targetTexture=target;
   var readback=new Texture2D(job.width,job.height,TextureFormat.RGBA32,false);
   var shader=Shader.Find("Sprites/Default");
   if(shader==null)throw new Exception("Sprites/Default shader unavailable");
   var material=new Material(shader);
   int frame=0;
   foreach(var shot in job.scenes) {
    Color background;if(!ColorUtility.TryParseHtmlString(shot.background,out background))throw new Exception("Invalid background");
    camera.backgroundColor=background;
    var renderers=new SpriteRenderer[shot.objects.Length];
    var textures=new Texture2D[shot.objects.Length];
    for(int i=0;i<shot.objects.Length;i++) {
     var item=shot.objects[i];var tex=new Texture2D(2,2,TextureFormat.RGBA32,false);
     if(!ImageConversion.LoadImage(tex,File.ReadAllBytes(item.asset)))throw new Exception("Cannot decode sprite "+item.asset);
     tex.filterMode=FilterMode.Bilinear;tex.wrapMode=TextureWrapMode.Clamp;textures[i]=tex;
     var go=new GameObject(item.id);var sr=go.AddComponent<SpriteRenderer>();
     sr.sprite=Sprite.Create(tex,new Rect(0,0,tex.width,tex.height),new Vector2(0.5f,0.5f),100,0,SpriteMeshType.FullRect);
     sr.sharedMaterial=material;renderers[i]=sr;
    }
    using(var actors=new SemanticActors(shot,material)) {
    SemanticAnimationTests.CheckContacts(shot,actors);
    for(int local=0;local<shot.frames;local++) {
     double time=(double)local/job.fps;
     for(int i=0;i<shot.objects.Length;i++){
      var item=shot.objects[i];var sr=renderers[i];
      sr.transform.position=new Vector3(Evaluate(item.x,time),Evaluate(item.y,time),0);
      sr.transform.localScale=new Vector3(Evaluate(item.sx,time),Evaluate(item.sy,time),1);
      sr.transform.rotation=Quaternion.Euler(0,0,Evaluate(item.rotation,time));
      sr.color=new Color(1,1,1,Evaluate(item.opacity,time));
      sr.sortingOrder=(int)Math.Round(Evaluate(item.order,time),MidpointRounding.AwayFromZero);
     }
     actors.Evaluate(time);
     camera.Render();RenderTexture.active=target;
     readback.ReadPixels(new Rect(0,0,job.width,job.height),0,0);readback.Apply();
     File.WriteAllBytes(Path.Combine(job.output,"frame-"+frame.ToString("D6")+".png"),readback.EncodeToPNG());frame++;
    }
    }
    for(int i=0;i<renderers.Length;i++){UnityEngine.Object.DestroyImmediate(renderers[i].sprite);UnityEngine.Object.DestroyImmediate(renderers[i].gameObject);UnityEngine.Object.DestroyImmediate(textures[i]);}
   }
   RenderTexture.active=null;camera.targetTexture=null;target.Release();
   UnityEngine.Object.DestroyImmediate(target);UnityEngine.Object.DestroyImmediate(readback);UnityEngine.Object.DestroyImmediate(material);
   if(frame!=job.totalFrames)throw new Exception("Frame count mismatch");
   File.WriteAllText(Path.Combine(job.output,"unity-result.json"),JsonUtility.ToJson(new Result{version=Application.unityVersion}));
   Debug.Log("QTX rendered "+frame+" frames");
  }catch(Exception e){Debug.LogException(e);EditorApplication.Exit(1);}
 }
}
}
