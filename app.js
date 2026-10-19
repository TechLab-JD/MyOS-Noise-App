const root=document.getElementById('NoiseApp');
if(root){
  const $=id=>root.querySelector('#'+id);
  let ac=null,src=null,gain=null,type='white',playing=false;
  function makeBuffer(t){
    const len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);
    if(t==='white'){for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}
    else if(t==='pink'){let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;b2=0.96900*b2+w*0.1538520;b3=0.86650*b3+w*0.3104856;b4=0.55000*b4+w*0.5329522;b5=-0.7616*b5-w*0.0168980;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;b6=w*0.115926;}}
    else{let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+0.02*w)/1.02;d[i]=last*3.5;}}
    return buf;
  }
  function start(){ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();src=ac.createBufferSource();src.buffer=makeBuffer(type);src.loop=true;gain=ac.createGain();gain.gain.value=parseInt($('ns-vol').value)/100*0.6;src.connect(gain);gain.connect(ac.destination);src.start();playing=true;$('ns-toggle').textContent='■ Stop';}
  function stop(){if(src){src.stop();src.disconnect();src=null;}playing=false;$('ns-toggle').textContent='▶ Play';}
  $('ns-toggle').addEventListener('click',()=>playing?stop():start());
  root.querySelectorAll('.ns-types button').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.t;root.querySelectorAll('.ns-types button').forEach(x=>x.classList.toggle('on',x===b));if(playing){stop();start();}}));
  $('ns-vol').addEventListener('input',()=>{if(gain)gain.gain.value=parseInt($('ns-vol').value)/100*0.6;});
  root.addEventListener('myos:close',()=>{if(playing)stop();});
}
