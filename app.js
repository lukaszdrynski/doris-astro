/* ==== reveal on scroll ==== */
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
},{rootMargin:"0px 0px -10% 0px", threshold:.08});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

/* ==== stat counters ==== */
const countIO = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      function tick(now){
        const t = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-t, 3);
        el.textContent = Math.round(target * eased).toLocaleString('pl-PL');
        if(t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    }
  }
},{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

/* ==== live clock in topbar ==== */
function tickClock(){
  const d = new Date();
  const hh = d.toLocaleTimeString('pl-PL', {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Warsaw'});
  const clock = document.getElementById('clock');
  if(clock) clock.textContent = hh + ' CET';
}
tickClock(); setInterval(tickClock, 30_000);

/* ==== mark current nav link active ==== */
(() => {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a.navlink').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ==== gentle parallax on portrait chips ==== */
const right = document.querySelector('.hero-right');
if(right && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const chips = right.querySelectorAll('.chip');
  right.addEventListener('mousemove', (e)=>{
    const r = right.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    chips.forEach((c,i)=>{
      const k = (i+1) * 6;
      const rot = c.dataset.rot || 0;
      c.style.transform = `translate(${x*k}px, ${y*k}px) rotate(${rot}deg)`;
    });
  });
  right.addEventListener('mouseleave', ()=>{
    chips.forEach(c => {
      const rot = c.dataset.rot || 0;
      c.style.transform = `rotate(${rot}deg)`;
    });
  });
}
