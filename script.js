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

  // Contact form: prevent real submit (no backend included) and show in-page confirmation
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic client-side validation already enforced by required attributes
      const name = (contactForm.querySelector('[name="name"]') || {}).value || '';
      showToast(`Thanks ${name ? name.split(' ')[0] : ''}! Message received. We'll reply to your email shortly.`);
      contactForm.reset();
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

})();
