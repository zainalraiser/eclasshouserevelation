(() => {
  const canvas=document.getElementById("starfield"),ctx=canvas.getContext("2d");
  let stars=[],w=0,h=0;
  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=w+"px"; canvas.style.height=h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:Math.min(220,Math.floor(w*h/7000))},()=>({
      x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.35+.25,a:Math.random()*.65+.2,
      speed:Math.random()*.0007+.0002,phase:Math.random()*Math.PI*2
    }));
  }
  function draw(t){
    ctx.clearRect(0,0,w,h);
    stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(220,235,255,${s.a*(.68+.32*Math.sin(t*s.speed+s.phase))})`;ctx.fill()});
    requestAnimationFrame(draw);
  }
  addEventListener("resize",resize);resize();requestAnimationFrame(draw);
})();
