(() => {
  const tracks = {
    altar: 'assets/audio/star-altar.ogg',
    awakening: 'assets/audio/star-awakening.ogg',
    mentor: 'assets/audio/mentor-reveal.ogg',
    Aldebaran: 'assets/audio/reveal-aldebaran.ogg',
    Sirius: 'assets/audio/reveal-sirius.ogg'
  };

  let current = null;
  let muted = false;
  let volume = 0.28;
  const players = {};

  Object.entries(tracks).forEach(([key, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    a.loop = key === 'altar';
    a.volume = 0;
    players[key] = a;
  });

  function fade(audio, target, ms = 900) {
    if (!audio) return Promise.resolve();
    const start = audio.volume;
    const steps = 30;
    const delta = target - start;
    return new Promise(resolve => {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        audio.volume = Math.max(0, Math.min(1, start + delta * (i / steps)));
        if (i >= steps) { clearInterval(timer); resolve(); }
      }, ms / steps);
    });
  }

  async function play(key, restart = false) {
    const next = players[key];
    if (!next) return;
    if (restart) next.currentTime = 0;
    const target = muted ? 0 : volume;
    if (current && current !== next) await fade(current, 0, 600);
    if (current && current !== next) current.pause();
    current = next;
    try {
      await next.play();
      await fade(next, target, 900);
    } catch (err) {
      // Browser autoplay policy: audio starts after the user's next interaction.
    }
  }

  function stop() {
    Object.values(players).forEach(a => { a.pause(); a.currentTime = 0; a.volume = 0; });
    current = null;
  }

  function toggleMute() {
    muted = !muted;
    if (current) current.volume = muted ? 0 : volume;
    updateButton();
  }

  function updateButton() {
    const btn = document.getElementById('audioToggle');
    if (!btn) return;
    btn.textContent = muted ? '♩' : '♫';
    btn.setAttribute('aria-label', muted ? 'Turn music on' : 'Mute music');
    btn.classList.toggle('muted', muted);
  }

  function mount() {
    const btn = document.createElement('button');
    btn.id = 'audioToggle';
    btn.className = 'audio-toggle';
    btn.type = 'button';
    btn.textContent = '♫';
    btn.setAttribute('aria-label', 'Mute music');
    btn.title = 'Music on / off';
    btn.addEventListener('click', () => {
      toggleMute();
      if (!muted && current) current.play().catch(() => {});
    });
    document.body.appendChild(btn);
  }

  window.EClasAudio = { play, stop, toggleMute, mount };
  document.addEventListener('DOMContentLoaded', mount);
})();
