// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  /* =========================
   * Smooth scrolling for nav
   * ========================= */
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .scroll-indicator[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, { passive: true });
  });

  /* =========================
   * Navbar background on scroll
   * ========================= */
  const navbar = document.querySelector('.navbar');
  const setNavBg = () => {
    if (!navbar) return;
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(0, 0, 0, 0.95)';
      navbar.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.08)';
    } else {
      navbar.style.background = 'rgba(0, 0, 0, 0.9)';
      navbar.style.boxShadow = 'none';
    }
  };
  setNavBg();
  window.addEventListener('scroll', setNavBg, { passive: true });

  /* =========================
   * Parallax (hero)
   * ========================= */
  const heroContent = document.querySelector('.hero-content');
  const floatingElements = document.querySelector('.floating-elements');
  let ticking = false;

  const onScrollParallax = () => {
    const scrolled = window.pageYOffset || 0;
    const rate = scrolled * -0.5;
    const rate2 = scrolled * -0.3;
    if (heroContent) heroContent.style.transform = `translateY(${rate2}px)`;
    if (floatingElements) floatingElements.style.transform = `translateY(${rate}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollParallax);
      ticking = true;
    }
  }, { passive: true });

  /* =========================
   * Animated counters
   * ========================= */
  const animateCounter = (el, target) => {
    const duration = 1600; // ms
    const start = performance.now();
    const from = 0;

    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.floor(from + (target - from) * eased);
      el.textContent = val.toLocaleString() + '+';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      if (!Number.isFinite(target)) return;
      animateCounter(el, target);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });

  document.querySelectorAll('.impact-number').forEach(el => counterObserver.observe(el));

  /* =========================
   * Service card hover
   * ========================= */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-15px) scale(1.03)';
      card.style.boxShadow = '0 25px 50px rgba(124, 58, 237, 0.25)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = 'none';
    });
  });

  /* =========================
   * Impact card reveal
   * ========================= */
  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      impactObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.impact-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all .6s ease ${i * 0.15}s`;
    impactObserver.observe(card);
  });

  /* =========================
   * Ripple effect on buttons
   * ========================= */
  const clickable = document.querySelectorAll('button, .btn, .btn-primary, .btn-secondary');
  clickable.forEach(btn => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* =========================
   * Floating particles
   * ========================= */
  const createFloatingParticles = () => {
    const count = 16;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'floating-particle';
      document.body.appendChild(p);
      particles.push(p);
    }
    const animate = () => {
      const t = performance.now();
      const w = window.innerWidth, h = window.innerHeight;
      particles.forEach((p, i) => {
        const x = Math.sin(t * 0.001 + i) * 120 + w * 0.5;
        const y = Math.cos(t * 0.0015 + i) * 60 + h * 0.5;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.opacity = (Math.sin(t * 0.002 + i) * 0.5 + 0.5).toFixed(2);
      });
      requestAnimationFrame(animate);
    };
    animate();
  };
  createFloatingParticles();

  /* =========================
   * Section entrance animation
   * ========================= */
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('animate-in'));
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

  /* =========================
   * Mobile menu toggle
   * ========================= */
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  menuBtn?.addEventListener('click', () => menu?.classList.toggle('open'));

  /* =========================
   * Social/email icons
   * ========================= */
  const socialLinks = document.querySelectorAll('.social-icon');
  socialLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.classList.contains('email')) {
        e.preventDefault();
        window.location.href = 'mailto:beaconofhjopeagsd@gmail.com';
      }
    });
  });

  /* =========================
   * Footer year
   * ========================= */
  document.getElementById('year').textContent = new Date().getFullYear();
});

