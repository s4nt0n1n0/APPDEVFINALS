// Single guarded initialization on DOM ready

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

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

  // Download CV
  const download = document.getElementById('downloadCV');
  if (download) {
    download.addEventListener('click', async (e) => {
      const href = download.getAttribute('href');
      if (!href) return;

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

  // Navbar shadow on scroll
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

  // small reusable modal
  function showModal(title, message) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--card-light);color:inherit;padding:1rem 1.25rem;border-radius:10px;z-index:10002;box-shadow:0 20px 60px rgba(2,6,23,0.25);max-width:420px;';
    modal.innerHTML = `<h3 style="margin:0 0 .5rem;">${title}</h3><p style="margin:0 0 .75rem;color:var(--muted);">${message}</p><div style="text-align:right"><button id=modalClose style=\"padding:.5rem .75rem;border-radius:8px;border:0;background:var(--primary);color:#fff;cursor:pointer\">Close</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('modalClose').addEventListener('click', () => modal.remove());
    setTimeout(() => { try { modal.remove(); } catch(e){} }, 7000);

    
  }
});

