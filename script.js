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
const navLinks = document.querySelectorAll('.nav-link');

/* EFECTO SCROLL (blur + sombra elegante) */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
});

/* ACTIVE LINK DINÁMICO (SUAVE Y PRECISO) */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* ─────────────────── HAMBURGER PREMIUM ─────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');

  // 🔥 Bloquea scroll cuando menú está abierto
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
});

/* CERRAR MENÚ AL HACER CLICK */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
  });
});

/* ─────────────────── EFECTO SUAVE AL HACER CLICK ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
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
  const form = document.getElementById("contactForm");
const successMsg = document.getElementById("formSuccess");
const btnText = document.getElementById("btnText");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // VALIDACIÓN BÁSICA (usa la tuya si ya tienes)
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !correo || !mensaje) {
    alert("Completa todos los campos");
    return;
  }

  // LOADER EN BOTÓN
  btnText.innerText = "Enviando...";
  form.querySelector("button").disabled = true;

  // 🔥 MAPEO A EMAILJS
  const params = {
    name: nombre,
    email: correo,
    message: mensaje
  };
  /* ─────────────────── service id, template id ─────────────────── */
  emailjs.send("service_exp6h7i", "template_ng6x5bv", params)
    .then(() => {
      successMsg.classList.add("show");
      form.reset();

      setTimeout(() => {
        successMsg.classList.remove("show");
      }, 4000);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al enviar el mensaje ❌");
    })
    .finally(() => {
      btnText.innerText = "Enviar mensaje";
      form.querySelector("button").disabled = false;
    });
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
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_exp6h7i", "template_ng6x5bv", this)
    .then(() => {
      showSuccess();
      this.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      showError();
    });
});

/* MENSAJE PRO (sin alert feo) */
function showSuccess() {
  const msg = document.createElement("div");
  msg.innerText = "✅ Mensaje enviado correctamente";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.padding = "12px 20px";
  msg.style.background = "rgba(0,255,136,0.1)";
  msg.style.border = "1px solid rgba(0,255,136,0.4)";
  msg.style.color = "#00ff88";
  msg.style.borderRadius = "8px";
  msg.style.backdropFilter = "blur(10px)";
  msg.style.boxShadow = "0 0 20px rgba(0,255,136,0.2)";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}

function showError() {
  const msg = document.createElement("div");
  msg.innerText = "❌ Error al enviar el mensaje";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.padding = "12px 20px";
  msg.style.background = "rgba(255,0,80,0.1)";
  msg.style.border = "1px solid rgba(255,0,80,0.4)";
  msg.style.color = "#ff4d6d";
  msg.style.borderRadius = "8px";
  msg.style.backdropFilter = "blur(10px)";
  msg.style.boxShadow = "0 0 20px rgba(255,0,80,0.2)";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}
