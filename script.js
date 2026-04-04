/* ═══════════════════════════════════════════════════════════════════════
   CONTROL4.0— JavaScript
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────── CURSOR PERSONALIZADO ─────────────────── */
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  document.querySelectorAll('a, button, .service-card, .gallery-item, .info-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      cursor.style.opacity = '0.6';
      trail.style.width  = '50px';
      trail.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursor.style.opacity = '1';
      trail.style.width  = '30px';
      trail.style.height = '30px';
    });
  });

  /* ─────────────────── PARTICLE CANVAS ─────────────────── */
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ─────────────────── NAVBAR ─────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Active link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  /* ─────────────────── HAMBURGER ─────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────── SCROLL REVEAL ─────────────────── */
  const revealElements = document.querySelectorAll(
    '.section-label, .section-title, .about-text, .about-cards, ' +
    '.info-card, .service-card, .gallery-item, .contact-info, .contact-form'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), +delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─────────────────── COUNTER ANIMATION ─────────────────── */
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target   = +el.dataset.target;
    const duration = 1800;
    const start    = performance.now();
    (function update(now) {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target;
    })(start);
  }

  /* ─────────────────── SERVICE CARDS TILT ─────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      card.style.transformOrigin = 'center';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg)';
    });
  });

  /* ─────────────────── CONTACT FORM ─────────────────── */
  const form    = document.getElementById('contactForm');
  const btnText = document.getElementById('btnText');
  const success = document.getElementById('formSuccess');

  function validateField(id, errorId, testFn) {
    const field = document.getElementById(id);
    const err   = document.getElementById(errorId);
    const valid = testFn(field.value.trim());
    err.classList.toggle('show', !valid);
    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const n = validateField('nombre', 'nombreError', v => v.length >= 2);
    const c = validateField('correo', 'correoError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const m = validateField('mensaje', 'mensajeError', v => v.length >= 10);

    if (n && c && m) {
      // Simulate send
      btnText.textContent = 'Enviando…';
      form.querySelector('button').disabled = true;
      setTimeout(() => {
        form.reset();
        success.classList.add('show');
        btnText.textContent = 'Enviar mensaje';
        form.querySelector('button').disabled = false;
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 1500);
    }
  });

  // Inline validation on blur
  document.getElementById('nombre').addEventListener('blur', () =>
    validateField('nombre', 'nombreError', v => v.length >= 2));
  document.getElementById('correo').addEventListener('blur', () =>
    validateField('correo', 'correoError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)));
  document.getElementById('mensaje').addEventListener('blur', () =>
    validateField('mensaje', 'mensajeError', v => v.length >= 10));

  /* ─────────────────── SMOOTH SCROLL OFFSET ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────── GALLERY PARALLAX ─────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    galleryItems.forEach((item, i) => {
      const rect   = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const factor = (i % 3) * 0.04;
        const visual = item.querySelector('.gallery-visual');
        if (visual) visual.style.transform = `translateY(${scrollY * factor - rect.top * factor * 0.3}px)`;
      }
    });
  });

  /* ─────────────────── TYPING EFFECT for badge ─────────────────── */
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    const originalText = badge.textContent.trim();
    badge.dataset.full = originalText;
  }

});
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.slide');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prev.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});