import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const $=id=>document.getElementById(id);
const requestedDemo=new URLSearchParams(location.search).get('demo');
const demo=['01','02','03'].includes(requestedDemo)?requestedDemo:'01';
const assetVersion='20260917-2';
let renderer,controls,camera,data,selected,tween;
const photos=[],objects=[];
const v=a=>new THREE.Vector3(...a);
const status=text=>{$('status').textContent=text;};

async function init(){
  const response=await fetch(`demo-${demo}.json?v=${assetVersion}`);
  if(!response.ok)throw new Error('Model details are unavailable.');
  data=await response.json();$('demoName').textContent=data.label;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9edf0);
  camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.02,10000);camera.up.set(0,0,1);
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);$('scene').append(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.rotateSpeed=.65;controls.minPolarAngle=.025;controls.maxPolarAngle=Math.PI-.025;controls.screenSpacePanning=false;controls.minDistance=8;controls.maxDistance=1500;
  home(true);
  const file=await fetch(`${data.model}?v=${assetVersion}`);if(!file.ok)throw new Error('Model download failed. Please reload.');
  const buffer=await new Response(file.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  const header=new DataView(buffer);if(header.getUint32(0,true)!==0x31505444)throw new Error('Invalid model.');
  const count=header.getUint32(4,true);
  if(buffer.byteLength!==8+count*15)throw new Error('Incomplete model download.');
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,8,count*3),3));
  const bytes=new Uint8Array(buffer,8+count*12,count*3),colors=new Float32Array(count*3),color=new THREE.Color();
  for(let i=0;i<count;i++){color.setRGB(bytes[i*3]/255,bytes[i*3+1]/255,bytes[i*3+2]/255,THREE.SRGBColorSpace);colors.set([color.r,color.g,color.b],i*3);}
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.computeBoundingSphere();
  scene.add(new THREE.Points(geometry,new THREE.PointsMaterial({size:demo==='01'?2.1:2.4,sizeAttenuation:false,vertexColors:true})));
  const grid=new THREE.GridHelper(250,30,0xaab8c1,0xcbd3d9);grid.rotation.x=Math.PI/2;grid.position.z=data.bounds.min[2]-.6;grid.material.transparent=true;grid.material.opacity=.32;scene.add(grid);
  const dotGeometry=new THREE.SphereGeometry(.9,12,8);
  const baseMaterial=new THREE.MeshBasicMaterial({color:0xe28a12});
  const selectedMaterial=new THREE.MeshBasicMaterial({color:0xf43f5e});
  for(const [index,photo] of data.photos.entries()){
    photo.image+=`?v=${assetVersion}`;
    const dot=new THREE.Mesh(dotGeometry,baseMaterial);dot.position.copy(v(photo.center));dot.userData.photo=photo;
    const center=v(photo.center),dir=v(photo.forward).normalize(),right=v(photo.right).normalize(),up=new THREE.Vector3().crossVectors(right,dir).normalize();
    const end=center.clone().addScaledVector(dir,6),corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>end.clone().addScaledVector(right,x*2.5).addScaledVector(up,y*1.6));
    const points=[];corners.forEach((p,i)=>points.push(...center.toArray(),...p.toArray(),...p.toArray(),...corners[(i+1)%4].toArray()));
    const cone=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(points,3)),new THREE.LineBasicMaterial({color:0xcb7705,transparent:true,opacity:.8}));cone.userData.photo=photo;
    photo.dot=dot;photo.cone=cone;photos.push(photo);objects.push(dot,cone);scene.add(dot,cone);
    const button=document.createElement('button');button.title=photo.label;button.setAttribute('aria-label',photo.label);button.setAttribute('aria-pressed','false');
    const img=document.createElement('img');img.src=photo.image;img.alt='';img.loading='lazy';img.decoding='async';
    const label=document.createElement('span');label.textContent=String(index+1).padStart(2,'0');button.append(img,label);
    button.onclick=()=>select(photo);$('photoStrip').append(button);photo.button=button;
  }
  function select(photo){if(selected){selected.dot.material=baseMaterial;selected.button.setAttribute('aria-pressed','false');}selected=photo;photo.dot.material=selectedMaterial;photo.button.setAttribute('aria-pressed','true');$('photoName').textContent=photo.label;$('photoPreview').src=photo.image;$('photoPreview').alt=photo.label;$('photoPanel').hidden=false;}
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();ray.params.Line.threshold=.6;let press;
  renderer.domElement.addEventListener('pointerdown',e=>{tween=null;press={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};},true);
  renderer.domElement.addEventListener('pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>5)press.moved=true;});
  renderer.domElement.addEventListener('pointerup',e=>{if(press&&!press.moved&&press.id===e.pointerId&&e.button===0){pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(objects.filter(o=>o.visible),false);if(hits.length)select(hits[0].object.userData.photo);}press=null;});
  renderer.domElement.addEventListener('pointercancel',()=>{press=null;});
  renderer.domElement.addEventListener('touchstart',e=>{if(e.touches.length>1)press=null;},{passive:true});
  $('showPhotos').onchange=()=>{for(const obj of objects)obj.visible=$('showPhotos').checked;};
  $('home').onclick=()=>home();$('zoomIn').onclick=()=>zoom(.8);$('zoomOut').onclick=()=>zoom(1.25);
  $('closePhoto').onclick=()=>{$('photoPanel').hidden=true;};
  $('focus').onclick=()=>{if(selected){const p=v(selected.center);move(p.clone().addScaledVector(v(selected.forward),-15).add(v([0,0,5])),p);}};
  $('look').onclick=()=>{if(selected){const p=v(selected.center);move(p,p.clone().addScaledVector(v(selected.forward),25));}};
  $('openPhoto').onclick=openPhoto;$('previewButton').onclick=openPhoto;$('photoPreview').ondblclick=openPhoto;
  $('closeFull').onclick=()=>$('photoDialog').close();
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status('Full screen is unavailable in this browser.');}};
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
  const animate=now=>{requestAnimationFrame(animate);if(tween){const t=Math.min(1,(now-tween.time)/600),ease=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,ease);controls.target.lerpVectors(tween.targetFrom,tween.targetTo,ease);if(t===1)tween=null;}controls.update();const dir=controls.target.clone().sub(camera.position);$('needle').style.transform=`rotate(${-THREE.MathUtils.radToDeg(Math.atan2(dir.x,dir.y))}deg)`;renderer.render(scene,camera);};
  requestAnimationFrame(animate);document.body.dataset.ready='true';document.body.dataset.points=String(count);
  status(`${data.label} | ${photos.length} photo views | Visual documentation`);
}
function move(position,target){controls.enableDamping=false;controls.update();controls.enableDamping=true;tween={from:camera.position.clone(),to:position.clone(),targetFrom:controls.target.clone(),targetTo:target.clone(),time:performance.now()};}
function home(instant=false){
  const dir=v(data.viewDirection).normalize(),right=new THREE.Vector3().crossVectors(camera.up,dir).normalize(),up=new THREE.Vector3().crossVectors(dir,right).normalize();
  const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));let distance=10;
  for(const x of [data.bounds.min[0],data.bounds.max[0]])for(const y of [data.bounds.min[1],data.bounds.max[1]])for(const z of [data.bounds.min[2],data.bounds.max[2]]){const p=v([x,y,z]);distance=Math.max(distance,p.dot(dir)+Math.max(Math.abs(p.dot(up))/tan,Math.abs(p.dot(right))/(tan*camera.aspect)));}
  const position=dir.multiplyScalar(distance*1.1),target=v([0,0,0]);
  if(instant){camera.position.copy(position);controls.target.copy(target);controls.update();}else move(position,target);
}
function zoom(factor){const target=controls.target.clone(),delta=camera.position.clone().sub(target);delta.setLength(THREE.MathUtils.clamp(delta.length()*factor,controls.minDistance,controls.maxDistance));move(target.clone().add(delta),target);}
function openPhoto(){if(!selected)return;$('fullPhoto').src=selected.image;$('fullPhoto').alt=selected.label;$('fullPhotoName').textContent=selected.label;if(!$('photoDialog').open)$('photoDialog').showModal();}
init().catch(error=>{status(error.message+' You can reload this demo or return to the preview.');document.body.dataset.error='true';console.error(error);});
