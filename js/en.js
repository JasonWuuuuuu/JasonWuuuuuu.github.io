/* =============================================
   Jason Wu — English homepage interactions
   ============================================= */

(() => {
  'use strict';

  /* ---------- custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const isTouch = window.matchMedia('(hover:none)').matches || window.innerWidth < 760;

  if (!isTouch && dot && ring) {
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // hover state on interactive elements
    const hoverSel = 'a, button, .tilt, [data-magnetic], .hero-tags span, .pf-tags span, .rc-tags span';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    // hide on iframe/leave
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ---------- particle network ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const colors = ['#22e9ff', '#ff2ec4', '#a855f7', '#3b82f6'];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const density = Math.min(90, Math.floor(W * H / 18000));
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6,
          c: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let mouseX = -9999, mouseY = -9999;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            const a = (1 - d / 130) * 0.18;
            ctx.strokeStyle = `rgba(120,180,255,${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        // mouse link
        const mdx = p.x - mouseX, mdy = p.y - mouseY;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 180) {
          const a = (1 - md / 180) * 0.4;
          ctx.strokeStyle = `rgba(34,233,255,${a})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- nav: scroll state + mobile menu + spy ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    })
  );

  const sections = [...document.querySelectorAll('section[id]')];
  const navAs = [...links.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.glass-card, .news-list li, .tl-item, .sec-title, .hero-kicker, .hero-tags, .hero-cta, .hero-meta');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- typewriter ---------- */
  const tw = document.getElementById('typewriter');
  if (tw) {
    const phrases = [
      'Ph.D. researcher in transportation AI.',
      'Building CAV algorithms that survive the field.',
      'From lane-change theory → edge deployment.',
      'Mixed human–machine traffic, decoded.'
    ];
    let pi = 0, ci = 0, deleting = false;
    const type = () => {
      const cur = phrases[pi];
      if (deleting) {
        ci--;
        tw.textContent = cur.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 360); return; }
        setTimeout(type, 28);
      } else {
        ci++;
        tw.textContent = cur.slice(0, ci);
        if (ci === cur.length) { deleting = true; setTimeout(type, 1900); return; }
        setTimeout(type, 48 + Math.random() * 40);
      }
    };
    setTimeout(type, 800);
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat[data-count]');
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const b = el.querySelector('b');
      const dur = 1200;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        b.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(step);
        else b.textContent = target.toString();
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  /* ---------- magnetic buttons ---------- */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 18;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (!isTouch) {
    document.querySelectorAll('.tilt').forEach(card => {
      const max = 6;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -2 * max;
        const ry = (px - 0.5) * 2 * max;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- smooth-scroll for hash links (offset for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', id);
    });
  });

  /* ---------- subtle parallax on hero photo ---------- */
  const photo = document.querySelector('.photo-frame');
  if (photo && !isTouch) {
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      photo.style.setProperty('--px', dx);
      photo.style.setProperty('--py', dy);
    });
  }
})();
