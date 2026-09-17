(() => {
  const stage=document.getElementById('demoStage');
  const poster=document.getElementById('demoPoster');
  const launch=document.getElementById('loadDemo');
  const close=document.getElementById('unloadDemo');
  const tabs=[...document.querySelectorAll('[data-demo]')];
  let selected='01';
  const track=(action)=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'digital_twin_demo',action,demo:selected});};
  function unload(){stage.querySelector('iframe')?.remove();poster.hidden=false;launch.hidden=false;close.hidden=true;}
  function select(tab){unload();selected=tab.dataset.demo;tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});stage.setAttribute('aria-labelledby',tab.id);poster.src=`../assets/digital-twins/demo-${selected}-preview.webp`;poster.alt=selected==='01'?'3D earthwork model with photo camera positions':'3D property model with photo camera positions';document.getElementById('standaloneDemo').href=`../assets/digital-twins/viewer.html?demo=${selected}`;track('select');}
  tabs.forEach((tab,index)=>{tab.onclick=()=>select(tab);tab.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=tabs[(index+1)%tabs.length];if(event.key==='ArrowLeft')next=tabs[(index+tabs.length-1)%tabs.length];if(event.key==='Home')next=tabs[0];if(event.key==='End')next=tabs[tabs.length-1];if(next){event.preventDefault();select(next);next.focus();}};});
  launch.onclick=()=>{if(stage.querySelector('iframe'))return;const iframe=document.createElement('iframe');iframe.title=`Interactive Digital Twin Demo ${selected}`;iframe.src=`../assets/digital-twins/viewer.html?demo=${selected}`;iframe.allow='fullscreen';iframe.setAttribute('allowfullscreen','');stage.append(iframe);poster.hidden=true;launch.hidden=true;close.hidden=false;track('launch');};
  close.onclick=()=>{unload();launch.focus();track('close');};
  if(new URLSearchParams(location.search).get('demo')==='02')select(tabs[1]);
})();
