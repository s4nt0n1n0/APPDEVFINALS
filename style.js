// Single guarded initialization on DOM ready

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // ============================================
  // THEME MANAGEMENT
  // ============================================

  // Restore saved theme preference
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      body.classList.add('dark-mode');
    }
  } catch (e) {}

  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Update icon to match current theme
    if (body.classList.contains('dark-mode')) {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (e) {}

      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  // ============================================
  // ANTI-GRAVITY BACKGROUND
  // ============================================

  // Anti-gravity background initializer (floating decorative blobs)
  function initAntiGravity(opts = {}) {
    const { count = 7, minSize = 80, maxSize = 260 } = opts;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.innerWidth < 680) return; // skip on small screens
      const container = document.querySelector('.anti-gravity');
      if (!container) return;

      // clear any existing
      container.innerHTML = '';

      for (let i = 0; i < count; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        b.style.width = size + 'px';
        b.style.height = size + 'px';

        // random position - allow some overflow for nicer effect
        b.style.left = (Math.random() * 110 - 5) + '%';
        b.style.top = (Math.random() * 110 - 5) + '%';

        // assign size class for subtle color variance
        if (size < (minSize + maxSize) / 3) b.classList.add('small');
        else if (size < (minSize + maxSize) * 0.66) b.classList.add('medium');
        else b.classList.add('large');

        const dur = (Math.random() * 18) + 22; // 22s - 40s
        const delay = (Math.random() * -dur).toFixed(2);
        b.style.animation = `antiFloat ${dur}s ease-in-out ${delay}s infinite`;
        b.style.opacity = (0.45 + Math.random() * 0.5).toFixed(2);
        container.appendChild(b);
      }
    } catch (e) { console.warn('Anti-gravity init failed', e) }
  }

  // initialize anti-gravity after everything else
  try { initAntiGravity({count:7}); } catch(e) {}

  // ============================================
  // NAVIGATION
  // ============================================

  // Update active nav link based on scroll position
  const updateActiveNav = () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  // Call on scroll
  window.addEventListener('scroll', updateActiveNav);
  // Call on load
  updateActiveNav();

  // Hamburger / mobile nav
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    const setHamburgerState = (open) => {
      navLinks.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      const spans = hamburger.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
      }
    };

    hamburger.addEventListener('click', () => setHamburgerState(!navLinks.classList.contains('active')));

    // keyboard support
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setHamburgerState(!navLinks.classList.contains('active'));
      }
      if (e.key === 'Escape') setHamburgerState(false);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setHamburgerState(false));
    });
  }

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // use nav height offset so fixed nav doesn't cover content
        const navEl = document.querySelector('nav');
        const navH = navEl ? navEl.offsetHeight : 72;
        const targetY = window.pageYOffset + target.getBoundingClientRect().top - navH - 12;

        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Update active nav link after smooth scroll
        setTimeout(updateActiveNav, 400);
      }
    });
  });

  // ============================================
  // HOME PAGE - Download CV
  // ============================================

  const download = document.getElementById('downloadCV');
  if (download) {
    download.addEventListener('click', async (e) => {
      const href = download.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        showModal('Resume not available', 'The resume file is currently unavailable. Please contact me via email.');
        return;
      }

      e.preventDefault();
      try {
        const res = await fetch(href, { method: 'HEAD' });
        if (res.ok) {
          // file exists — follow link
          window.location.href = href;
        } else {
          // show modal fallback
          showModal('Resume not found', 'It looks like the resume file is missing. Please contact me via email.');
        }
      } catch (err) {
        showModal('Resume unavailable', 'Could not reach the resume file — try again later or contact me.');
      }
    });
  }

  // ============================================
  // NAVBAR & SCROLL EFFECTS
  // ============================================

  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      const current = window.pageYOffset;
      if (current > 80) {
        nav.style.boxShadow = '0 12px 30px rgba(2,6,23,0.12)';
      } else {
        nav.style.boxShadow = '';
      }

      // back-to-top visibility and progress
      const back = document.getElementById('backToTop');
      if (back) {
        const show = current > 300;
        back.classList.toggle('show', show);
        try {
          const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
          const pct = docH > 0 ? Math.min(100, Math.round((current / docH) * 100)) : 0;
          const progressEl = back.querySelector('.bt-progress');
          if (progressEl) progressEl.style.width = pct + '%';
        } catch (e) {}
      }
    });

    // Keep nav visible on scroll: make it fixed and add body padding equal to nav height
    try {
      nav.style.position = 'fixed';
      nav.style.top = '0';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.zIndex = '10000';

      const setBodyPadding = () => {
        const h = nav.offsetHeight || 72;
        document.body.style.paddingTop = h + 'px';
      };

      // initial
      setBodyPadding();
      // update on resize to account for responsive nav height
      window.addEventListener('resize', setBodyPadding);
    } catch (e) {
      // ignore if not allowed
    }
  }

  // Back to top click
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // ABOUT PAGE - Certification Counter
  // ============================================

  const certCount = document.getElementById('certCount');
  if (certCount) {
    const targetCount = 5; // Change this to your actual number
    let currentCount = 0;
    const duration = 2000;
    const increment = targetCount / (duration / 16);

    const animateCounter = () => {
      currentCount += increment;
      if (currentCount < targetCount) {
        certCount.textContent = Math.floor(currentCount);
        requestAnimationFrame(animateCounter);
      } else {
        certCount.textContent = targetCount;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.disconnect();
        }
      });
    });

    observer.observe(certCount);
  }

  // ============================================
  // ABOUT PAGE - Current Time Display
  // ============================================

  const currentTime = document.getElementById('currentTime');
  if (currentTime) {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      currentTime.textContent = now.toLocaleTimeString('en-US', options);
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  // ============================================
  // ABOUT/CONTACT - Copy Email Button
  // ============================================

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactEmail = document.getElementById('contactEmail');

  if (copyEmailBtn && contactEmail) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = contactEmail.textContent || contactEmail.href.replace('mailto:', '');
      
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '✓ Copied!';
        copyEmailBtn.style.background = '#10b981';
        
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.background = '';
        }, 2000);
      } catch (err) {
        showModal('Copy Failed', 'Could not copy email. Please select and copy manually.');
      }
    });
  }

  // ============================================
  // CONTACT PAGE - DateTime Display
  // ============================================

  const currentDateTime = document.getElementById('currentDateTime');
  if (currentDateTime) {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      currentDateTime.textContent = now.toLocaleString('en-US', options);
    };

    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // ============================================
  // CONTACT PAGE - Form Validation
  // ============================================

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (input, validator) => {
      const formGroup = input.closest('.form-group');
      const isValid = validator(input.value.trim());

      if (isValid) {
        formGroup.classList.remove('error');
      } else {
        formGroup.classList.add('error');
      }

      return isValid;
    };

    // Real-time validation
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, val => val.length > 0);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, val => emailRegex.test(val));
      });
    }

    if (subjectInput) {
      subjectInput.addEventListener('blur', () => {
        validateField(subjectInput, val => val.length > 0);
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        validateField(messageInput, val => val.length > 10);
      });
    }

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, val => val.length > 0);
      const isEmailValid = validateField(emailInput, val => emailRegex.test(val));
      const isSubjectValid = validateField(subjectInput, val => val.length > 0);
      const isMessageValid = validateField(messageInput, val => val.length > 10);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // Simulate API delay (replace with actual form submission)
        await new Promise(resolve => setTimeout(resolve, 1500));

        successMessage.classList.add('show');
        successMessage.style.display = 'block';
        contactForm.reset();

        setTimeout(() => {
          successMessage.classList.remove('show');
          successMessage.style.display = 'none';
        }, 5000);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

      } catch (error) {
        showModal('Error', 'There was an error sending your message. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  // ============================================
  // FOOTER - Update Year
  // ============================================

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================
  // UTILITY - Modal
  // ============================================

  function showModal(title, message) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--card-light, #f8fafc);color:inherit;padding:1rem 1.25rem;border-radius:10px;z-index:10002;box-shadow:0 20px 60px rgba(2,6,23,0.25);max-width:420px;border:1px solid var(--border-light, #e2e8f0);';
    modal.innerHTML = `<h3 style="margin:0 0 .5rem;color:var(--primary, #2563eb);">${title}</h3><p style="margin:0 0 .75rem;color:var(--muted, #64748b);">${message}</p><div style="text-align:right"><button id="modalClose" style="padding:.5rem .75rem;border-radius:8px;border:0;background:var(--primary, #2563eb);color:#fff;cursor:pointer;font-weight:600;">Close</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('modalClose').addEventListener('click', () => modal.remove());
    setTimeout(() => { try { modal.remove(); } catch(e){} }, 7000);
  }
});