document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Mobile nav
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
        // Start counters in this section
        const counters = entry.target.querySelectorAll?.('.stat__num[data-count]') || [];
        counters.forEach(startCounter);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Counters
  function startCounter(el) {
    const target = parseFloat(el.getAttribute('data-count') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';

    const durationMs = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Also start any counters already in view on load
  document.querySelectorAll('.stat__num[data-count]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) startCounter(el);
  });

  // Demo tracking
  const trackBtn = document.querySelector('.track__form .btn');
  const trackingInput = document.getElementById('trackingId');
  const trackStatus = document.getElementById('trackStatus');

  if (trackBtn && trackingInput && trackStatus) {
    trackBtn.addEventListener('click', () => {
      const id = (trackingInput.value || '').trim();
      if (!id) {
        trackStatus.textContent = 'Please enter a tracking ID.';
        return;
      }
      trackStatus.textContent = 'Fetching status...';
      setTimeout(() => {
        const steps = ['Label created', 'Picked up', 'In transit', 'Arrived at hub', 'Out for delivery', 'Delivered'];
        const step = steps[Math.floor(Math.random() * steps.length)];
        const etaDays = Math.floor(Math.random() * 3) + 1;
        trackStatus.textContent = `Shipment ${id} — ${step}. ETA ${etaDays} day${etaDays > 1 ? 's' : ''}.`;
      }, 650);
    });
  }
});