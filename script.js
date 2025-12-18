// script.js - improved UX for buttons, theme toggle, mobile menu, demo/source placeholders

(function () {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');
  const yearSpan = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');

  // Set current year in footer
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Apply saved theme if present
  const saved = localStorage.getItem('nexyte-theme');
  if (saved === 'dark') {
    body.classList.add('dark');
    themeToggle && (themeToggle.textContent = 'Light');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
  }

  // Theme toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = body.classList.toggle('dark');
      themeToggle.textContent = isDark ? 'Light' : 'Dark';
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      localStorage.setItem('nexyte-theme', isDark ? 'dark' : 'light');
    });
  }

  // Mobile menu toggle
  mobileToggle && mobileToggle.addEventListener('click', function () {
    if (!nav) return;
    const isHidden = getComputedStyle(nav).display === 'none' || nav.style.display === '';
    nav.style.display = isHidden ? 'flex' : 'none';
  });

  // Close mobile nav when clicking outside (small screens)
  document.addEventListener('click', function (e) {
    const w = window.innerWidth || document.documentElement.clientWidth;
    if (w > 900) {
      if (nav) nav.style.display = '';
      return;
    }
    if (!mobileToggle || !nav) return;
    const target = e.target;
    if (target === mobileToggle || nav.contains(target)) return;
    nav.style.display = 'none';
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth <= 900 && nav) nav.style.display = 'none';
      }
    });
  });

  // Demo & Source buttons - show friendly placeholder modal/notice when href="#"
  document.querySelectorAll('.proj-links a').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const href = btn.getAttribute('href');
      // If it's a placeholder (href="#" or empty), show informative message
      if (!href || href === '#' || href.trim() === '') {
        e.preventDefault();
        const isLive = btn.classList.contains('live');
        const project = btn.dataset.demo || btn.dataset.source || 'this project';
        const action = isLive ? 'live demo' : 'source repository';
        // Use a non-blocking toast-like notice
        showToast(`No ${action} is published for "${project}" yet. We can share a demo or repo on request.`);
      }
    });
  });

  // Helper: simple toast notification (non-blocking)
  function showToast(message, timeout = 3500) {
    const existing = document.querySelector('.nxt-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'nxt-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, timeout);
  }

  // ==============================
  // Contact Form - FormBackend + Success Popup
  // ==============================
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Submission failed');
        
        contactForm.reset();
        if (successModal) {
          successModal.classList.add('active');
          successModal.setAttribute('aria-hidden', 'false');
        } else {
          showToast('Your response was submitted successfully. We will get back to you soon.');
        }

      })
      .catch(() => {
        showToast('Something went wrong. Please try again.');
      });
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function () {
      successModal.classList.remove('active');
      successModal.setAttribute('aria-hidden', 'true');
    });
  }


  // Add basic styles for toast (injected here so no extra file needed)
  (function addToastStyles() {
    if (document.getElementById('nxt-toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'nxt-toast-styles';
    style.textContent = `
      .nxt-toast{
        position:fixed;
        left:50%;
        transform:translateX(-50%) translateY(18px);
        bottom:6%;
        background:linear-gradient(90deg,var(--accent),var(--accent-2));
        color:white;
        padding:10px 16px;
        border-radius:10px;
        box-shadow:0 8px 24px rgba(11,43,110,0.25);
        opacity:0;
        transition:opacity .18s ease, transform .28s cubic-bezier(.2,.9,.2,1);
        z-index:9999;
        font-weight:700;
        pointer-events:none;
      }
      .nxt-toast.visible{opacity:1; transform:translateX(-50%) translateY(0);}
    `;
    document.head.appendChild(style);
  })();
  // ==============================
// ==============================
  // Scroll Reveal (Repeat on Scroll)
  // ==============================
  (function () {
    const elements = document.querySelectorAll('.reveal');

    function handleScrollReveal() {
      const windowHeight = window.innerHeight;
      const revealOffset = 120;

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();

        // Element enters viewport
        if (rect.top < windowHeight - revealOffset && rect.bottom > revealOffset) {
          el.classList.add('visible');
        } 
        // Element leaves viewport → reset animation
        else {
          el.classList.remove('visible');
        }
      });
    }

    window.addEventListener('scroll', handleScrollReveal);
    window.addEventListener('resize', handleScrollReveal);
    window.addEventListener('load', handleScrollReveal);
  })();

  // Free audit prefill
  document.querySelectorAll('.audit-request').forEach(btn => {
    btn.addEventListener('click', () => {
      const message = document.getElementById('message');
      if (!message) return;

      message.value =
        "Hi Nexyte team,\n\n" +
        "I would like to request a FREE website audit.\n\n" +
        "Website URL:\n" +
        "What I want to improve:\n\n";

      message.focus();
    });
  });
  // FAQ toggle
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');
    });
  });

  // ==============================
  // Active Nav Link on Scroll
  // ==============================
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = Array.from(navLinks).map(link =>
    document.querySelector(link.getAttribute('href'))
  );

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((section, index) => {
      if (!section) return;
      const offsetTop = section.offsetTop - 120;
      const offsetBottom = offsetTop + section.offsetHeight;

      if (scrollY >= offsetTop && scrollY < offsetBottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[index].classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // Auto-fill message placeholder based on purpose
  const purposeSelect = document.getElementById('purpose');
  if (purposeSelect) {
    purposeSelect.addEventListener('change', function () {
      const message = document.getElementById('message');
      if (!message) return;

      switch (this.value) {
        case 'course':
          message.placeholder = 'Tell us which course you are interested in...';
          break;
        case 'technical':
          message.placeholder = 'Describe the technical issue you are facing...';
          break;
        case 'partnership':
          message.placeholder = 'Tell us about the partnership proposal...';
          break;
        default:
          message.placeholder = 'Tell us about your request...';
      }
    });
  }

  // ==============================
  // Tools accordion toggle
  // ==============================
  document.querySelectorAll('.tool-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.tool-card');
      card.classList.toggle('active');
      btn.textContent = card.classList.contains('active')
        ? 'Hide Details'
        : 'View Details';
    });
  });



})();

document.querySelectorAll('.demo-request').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const messageField = document.getElementById('message');
    if (!messageField) return;

    messageField.value =
      "Hi Nexyte team,\n" +
      "I would like to request a live demo of one of your projects.\n" +
      "Preferred demo type (optional): School / Hotel / Business\n" +
      "Please let me know the next steps.\n";

    messageField.focus();
  });
});
