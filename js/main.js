/* ============================================================
   AWWWARDS-INSPIRED CYBER-TECH PERSONAL WEBSITE
   Interactive Features — Particles, Cursor, Animations
   ============================================================ */

/* ---------- PARTICLES (Canvas) ---------- */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 120 };
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 12000));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
    ctx.fill();

    // Mouse interaction — push particles away
    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 1.2;
        p.y += Math.sin(angle) * force * 1.2;
      }
    }

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 130;

      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(123, 47, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(drawParticles);
}

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onMouseLeave() {
  mouse.x = null;
  mouse.y = null;
}

// Throttled resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    createParticles();
  }, 200);
});

// Initialize particles
resizeCanvas();
createParticles();
drawParticles();

window.addEventListener('mousemove', onMouseMove);
document.body.addEventListener('mouseleave', onMouseLeave);

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let trailX = cursorX;
let trailY = cursorY;
let targetX = cursorX;
let targetY = cursorY;

function updateCursor() {
  // Smooth interpolation for main cursor
  cursorX += (targetX - cursorX) * 0.2;
  cursorY += (targetY - cursorY) * 0.2;

  // Slower follow for trail
  trailX += (targetX - trailX) * 0.08;
  trailY += (targetY - trailY) * 0.08;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  cursorTrail.style.left = `${trailX}px`;
  cursorTrail.style.top = `${trailY}px`;

  requestAnimationFrame(updateCursor);
}

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// Touch devices — hide custom cursor
if (!('ontouchstart' in window)) {
  updateCursor();
} else {
  cursor.style.display = 'none';
  cursorTrail.style.display = 'none';
}

// Cursor hover effect on interactive elements
const hoverTargets = document.querySelectorAll(
  'a, button, .btn, .skill-tag, .project-card, .glass-card, input, textarea, .magnetic'
);

hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor--hover');
    cursorTrail.classList.add('cursor-trail--hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor--hover');
    cursorTrail.classList.remove('cursor-trail--hover');
  });
});

/* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');

        // Also handle stagger children if present
        if (entry.target.classList.contains('reveal-stagger')) {
          // Already handled by CSS cascade
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- NAVBAR SCROLL EFFECT ---------- */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function updateNavbar() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('nav--scrolled');
  } else {
    navbar.classList.remove('nav--scrolled');
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', updateNavbar, { passive: true });

/* ---------- MOBILE MENU ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('nav-toggle--active');
  navMenu.classList.toggle('nav-menu--open');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('nav-toggle--active');
    navMenu.classList.remove('nav-menu--open');
  });
});

/* ---------- TYPEWRITER EFFECT ---------- */
const typedElement = document.getElementById('typedText');
const words = [
  '精美的用户界面。',
  '高性能的后端服务。',
  '充满创意的交互体验。',
  '今天的未来。',
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typedTimeout;

function typeEffect() {
  const currentWord = words[wordIndex];
  const typeSpeed = isDeleting ? 40 : 80;
  const pauseBetween = isDeleting ? 800 : 2000;

  if (!isDeleting && charIndex <= currentWord.length) {
    typedElement.textContent = currentWord.substring(0, charIndex);
    charIndex++;
    if (charIndex > currentWord.length) {
      isDeleting = true;
      typedTimeout = setTimeout(typeEffect, pauseBetween);
      return;
    }
  } else if (isDeleting && charIndex >= 0) {
    typedElement.textContent = currentWord.substring(0, charIndex);
    charIndex--;
    if (charIndex < 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typedTimeout = setTimeout(typeEffect, 400);
      return;
    }
  }

  typedTimeout = setTimeout(typeEffect, typeSpeed);
}

// Start typewriter when hero is visible
const heroObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      typeEffect();
      heroObserver.unobserve(entries[0].target);
    }
  },
  { threshold: 0.5 }
);
heroObserver.observe(document.getElementById('hero'));

/* ---------- MAGNETIC BUTTONS ---------- */
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const strength = 0.3;

    el.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 600) {
    backToTop.classList.add('back-to-top--visible');
  } else {
    backToTop.classList.remove('back-to-top--visible');
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button');
  const originalText = btn.innerHTML;

  // Simulate sending
  btn.innerHTML = '发送中...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '✓ 消息已发送！';
    btn.style.background = 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 2500);
  }, 1200);
});

/* ---------- SMOOTH NAV SCROLL OFFSET ---------- */
// Adjust scroll position for fixed header
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

/* ---------- PARALLAX ON MOUSE (Hero) ---------- */
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

heroSection.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroContent.style.transform = `translate(${x}px, ${y}px)`;
  heroContent.style.transition = 'transform 0.1s ease-out';
});

heroSection.addEventListener('mouseleave', () => {
  heroContent.style.transform = 'translate(0, 0)';
  heroContent.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
});

/* ---------- INIT ---------- */
console.log('%c🚀 陈星宇 — 作品集已就绪 %c| %cAwwwards 风格赛博主题',
  'color: #00f0ff; font-size: 1.2em;',
  '',
  'color: #7b2fff;');
console.log('%c✨ 感谢你打开控制台一探究竟！ %c🔮',
  'color: #ff2d95;',
  '');
