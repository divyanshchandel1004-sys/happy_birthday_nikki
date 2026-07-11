/* ===================================================
   Shared interactivity: runaway button + ambient floaters + confetti
=================================================== */

// Makes a button dodge the cursor/finger a few times before letting the user click it
function setupDodge(id, maxDodges = 5){
  const btn = document.getElementById(id);
  if(!btn) return;
  let dodges = 0;

  function dodge(e){
    if(dodges >= maxDodges) return;
    e.preventDefault();
    dodges++;

    const stage = document.querySelector('.stage');
    const stageRect = stage.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = Math.max(stageRect.width - btnRect.width - 24, 0);
    const maxY = Math.max(stageRect.height - btnRect.height - 24, 0);

    const x = 12 + Math.random() * maxX;
    const y = 12 + Math.random() * maxY;

    btn.classList.add('dodging');
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';

    if(dodges >= maxDodges){
      btn.textContent = btn.dataset.caughtText || btn.textContent;
    }
  }

  btn.addEventListener('mouseenter', dodge);
  btn.addEventListener('touchstart', dodge, { passive: false });
}

// Scatters a handful of floating emoji across the page as ambient motion
function spawnFloaters(emojis, count = 14){
  const wrap = document.createElement('div');
  wrap.className = 'floaters';
  for(let i = 0; i < count; i++){
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (20 + Math.random() * 26) + 'px';
    span.style.animationDuration = (7 + Math.random() * 8) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    wrap.appendChild(span);
  }
  document.body.appendChild(wrap);
}

// Lightweight canvas confetti burst, no external libraries
function fireConfetti(){
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff7aa8', '#ffd166', '#5fe3c0', '#b8a4e8', '#ff5b6e'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    size: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: -1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    spin: -8 + Math.random() * 16,
  }));

  let frame = 0;
  const maxFrames = 260;

  function tick(){
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if(frame < maxFrames){
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(tick);
}
