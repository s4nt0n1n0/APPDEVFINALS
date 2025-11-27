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
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      const active = navLinks.classList.contains('active');
      if (spans.length >= 3) {
        spans[0].style.transform = active ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = active ? '0' : '1';
        spans[2].style.transform = active ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active nav link after smooth scroll
        setTimeout(updateActiveNav, 200);
      }
    });
  });

  // Download CV
  const download = document.getElementById('downloadCV');
  if (download) {
    download.addEventListener('click', (e) => {
      const href = download.getAttribute('href');
      if (!href) return;
      fetch(href, { method: 'HEAD' }).catch(() => {
        console.warn('resume.pdf not found or request blocked (preview).');
      });
    });
  }

  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('input[name="name"]');
      const name = nameInput ? nameInput.value : '';
      const success = document.createElement('div');
      success.textContent = `Thank you, ${name || 'friend'}! Your message has been received.`;
      success.style.cssText = `position:fixed;left:50%;top:20%;transform:translateX(-50%);background:#10b981;color:#fff;padding:1rem 1.25rem;border-radius:8px;z-index:10000;box-shadow:0 8px 30px rgba(2,6,23,0.2);`;
      document.body.appendChild(success);
      contactForm.reset();
      setTimeout(() => success.remove(), 3500);
    });
  }

  // Help button
  const helpButton = document.getElementById('helpButton');
  if (helpButton) {
    helpButton.addEventListener('click', () => {
      const helpMessage = document.createElement('div');
      helpMessage.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: white;">Portfolio Help</h3>
        <p style="margin-bottom: 0.5rem;">• Use the navigation menu to explore different sections</p>
        <p style="margin-bottom: 0.5rem;">• Click the moon/sun icon to toggle dark mode</p>
        <p style="margin-bottom: 0.5rem;">• Download CV button to get my resume (if added)</p>
        <p style="margin-bottom: 0.5rem;">• Use the contact form to send a message</p>
        <button id="closeHelp" style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; color: var(--primary); border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Got it!</button>
      `;
      helpMessage.style.cssText = `position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:linear-gradient(90deg,#4353FF,#6C7CFF);color:#fff;padding:1.25rem 1.5rem;border-radius:10px;z-index:10001;max-width:420px;box-shadow:0 18px 50px rgba(2,6,23,0.35);`;
      document.body.appendChild(helpMessage);
      const closer = document.getElementById('closeHelp');
      if (closer) closer.addEventListener('click', () => helpMessage.remove());
    });
  }

  // Section reveal animations
  try {
    const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -80px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(18px)';
      section.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(section);
    });
  } catch (e) {}

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
    });
  }

});
