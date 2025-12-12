// CRITICAL: This script MUST be inlined in <head> before any CSS loads
// Add this as <script> in <head> of ALL your HTML files:
/*
<script>
(function() {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  } catch(e) {}
})();
</script>
*/

// Main JavaScript - keep in external file
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // ============================================
  // THEME MANAGEMENT - Enhanced for smooth transitions
  // ============================================
  
  // Sync with preloaded dark mode from head script
  if (document.documentElement.classList.contains('dark-mode')) {
    body.classList.add('dark-mode');
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      document.documentElement.classList.toggle('dark-mode', isDark);
      
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  // ============================================
  // NAVIGATION - Set active link based on current page
  // ============================================
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'Home.html';
    const navLinks = document.querySelectorAll('.nav-links a:not(.theme-toggle)');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href');
      
      if (linkHref && (linkHref === currentPage || linkHref.split('/').pop() === currentPage)) {
        link.classList.add('active');
      }
    });
  };

  setActiveNavLink();

  const updateActiveSection = () => {
    const sections = document.querySelectorAll('.section[id]');
    const anchorLinks = document.querySelectorAll('.nav-links a[href^="#"]:not([href="#"])');
    
    if (anchorLinks.length === 0 || sections.length === 0) return;
    
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    anchorLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        link.classList.remove('active');
        if (href === '#' + current) {
          link.classList.add('active');
        }
      }
    });
  };

  if (document.querySelectorAll('.section[id]').length > 0) {
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
  }

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

  // Smooth scrolling for internal anchors
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
        
        setTimeout(updateActiveSection, 400);
      }
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
  // PROJECT FILTERING
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects with animation
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
    
    // Initialize all cards as visible
    projectCards.forEach(card => {
      card.style.transition = 'all 0.3s ease';
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
    const targetCount = 5;
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
  // TIME DISPLAYS
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
});