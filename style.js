// Unified JavaScript for all portfolio pages
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // ============================================
  // THEME MANAGEMENT
  // ============================================
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      body.classList.add('dark-mode');
    }
  } catch (e) {}

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
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
  // NAVIGATION - Update active link based on scroll (only for anchor links)
  // ============================================
  const updateActiveNav = () => {
    // Only update anchor links (#skills, #projects), not page links
    const sections = document.querySelectorAll('.section[id]');
    const anchorLinks = document.querySelectorAll('.nav-links a[href^="#"]:not([href="#"])');
    
    if (anchorLinks.length === 0) return; // No anchor links on this page
    
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    // Only update anchor links, don't touch page navigation links
    anchorLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  // Call on scroll and on load
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ============================================
  // HAMBURGER MENU
  // ============================================
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

  // Smooth scrolling for internal anchors only
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navEl = document.querySelector('nav');
        const navH = navEl ? navEl.offsetHeight : 72;
        const targetY = window.pageYOffset + target.getBoundingClientRect().top - navH - 12;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        
        // Update active nav link after smooth scroll
        setTimeout(updateActiveNav, 400);
      }
      // If target doesn't exist, let the browser handle it (for cross-page links)
    });
  });

  // ============================================
  // SCROLL EFFECTS
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

      const back = document.getElementById('backToTop');
      if (back) {
        back.classList.toggle('show', current > 300);
      }
    });
  }

  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // COPY EMAIL BUTTON
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
        alert('Could not copy email. Please select and copy manually.');
      }
    });
  }

  // ============================================
  // FOOTER YEAR
  // ============================================
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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
  // ABOUT/CONTACT PAGE - Current Time Display
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
  // HOME PAGE - Download CV
  // ============================================
  const downloadCV = document.getElementById('downloadCV');
  if (downloadCV) {
    downloadCV.addEventListener('click', async (e) => {
      const href = downloadCV.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        alert('Resume not available. Please contact me via email.');
      }
    });
  }
});