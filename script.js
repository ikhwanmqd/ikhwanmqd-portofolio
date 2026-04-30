/* ============================================================
   SCRIPT.JS — Ikhwan Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVBAR — Scroll + Active Link + Hamburger
  // ============================================================
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const sections  = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Active nav link based on scroll position
  const setActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // ============================================================
  // 2. TYPING ANIMATION
  // ============================================================
  const typedEl  = document.getElementById('typedName');
  const words    = ['Ikhwan', 'a Developer', 'a Trader',];
  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typingSpeed = 120;

  const type = () => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedEl.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;
      typingSpeed = 60;
    } else {
      typedEl.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  };

  type();

  // ============================================================
  // 3. COUNTER ANIMATION
  // ============================================================
  const counters = document.querySelectorAll('.count');
  let counted = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;

      const update = () => {
        current = Math.min(current + increment, target);
        counter.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(update);
        else counter.textContent = target;
      };
      requestAnimationFrame(update);
    });
    counted = true;
  };

  // ============================================================
  // 4. SCROLL REVEAL
  // ============================================================
  const revealEls = document.querySelectorAll(
    '.service-card, .project-card, .skill-item, .about-grid, .contact-grid, .section-header, .stat-box'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // Counter trigger (observe stats section)
  const statsSection = document.querySelector('.home-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) animateCounters();
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ============================================================
  // 5. SKILL BAR ANIMATION
  // ============================================================
  const skillBars = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.dataset.width;
          entry.target.style.width = targetWidth + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ============================================================
  // 6. SCROLL TO TOP BUTTON
  // ============================================================
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // 7. SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 8. CONTACT FORM SUBMIT
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      // Loading state
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#4ade80';
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ============================================================
  // 9. CURSOR GLOW (desktop only)
  // ============================================================
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.4s ease, top 0.4s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  // ============================================================
  // 10. NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP
  // ============================================================
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = currentScrollY;
  });

  navbar.style.transition = 'transform 0.3s ease, background 0.3s, box-shadow 0.3s';

}); // end DOMContentLoaded
