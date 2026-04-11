// === CURSOR ANIMATION ===
(function() {
  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!glow || !dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    // Glow: very lazy follow
    glowX = lerp(glowX, mouseX, 0.06);
    glowY = lerp(glowY, mouseY, 0.06);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';

    // Dot: fast precise
    dotX = lerp(dotX, mouseX, 0.55);
    dotY = lerp(dotY, mouseY, 0.55);
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';

    // Ring: medium lag
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(tick);
  }
  tick();

  // Expand ring on interactive elements
  document.querySelectorAll('a, button, [role="button"], input, textarea, select, label[for]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '58px';
      ring.style.height = '58px';
      ring.style.borderColor = 'rgba(37,99,235,0.7)';
      dot.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '38px';
      ring.style.height = '38px';
      ring.style.borderColor = 'rgba(37,99,235,0.45)';
      dot.style.opacity = '1';
    });
  });

  // Hide on mouse leave / show on enter
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Hide n8n Chat Tooltip When Clicked
document.addEventListener('click', (e) => {
  if (e.clientX > window.innerWidth - 120 && e.clientY > window.innerHeight - 120) {
    const tooltip = document.getElementById('chat-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.style.display = 'none', 300);
    }
  }
});

// === MOBILE HAMBURGER ===
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
}

// === ACTIVE NAV LINK ===
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// === SCROLL ANIMATIONS (Intersection Observer) ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right, .scale-up, .reveal-text').forEach(el => observer.observe(el));

// === NUMBER COUNTER ANIMATION ===
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// === CONTACT FORM ===
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const msg = document.getElementById('form-message');
    const consent = document.getElementById('terms-consent');

    // Validate consent checkbox
    if (consent && !consent.checked) {
      if (msg) {
        msg.className = 'form-message error';
        msg.textContent = '⚠ Please accept our Privacy Policy and Terms & Conditions to continue.';
        msg.style.display = 'block';
      }
      consent.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    // Simulate submission (replace with Formspree/backend endpoint)
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send Message →';
      if (msg) {
        msg.className = 'form-message success';
        msg.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';
        msg.style.display = 'block';
      }
      contactForm.reset();
    }, 1200);
  });
}

// === SMOOTH SCROLL for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
