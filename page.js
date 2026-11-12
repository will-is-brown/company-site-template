/* ============================================================================
   Company site template — client behaviour
   Everything here is progressive enhancement: the page is fully readable and
   usable with JavaScript disabled. No dependencies, no trackers.
   ========================================================================== */
(() => {
  'use strict';

  /* ---- 1. Mobile navigation ------------------------------------------------
     A disclosure button instead of a hidden menu, so the links stay in the
     accessibility tree and the control reports its own state. */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (nav && navToggle && navLinks) {
    const closeNav = () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Any link inside the menu closes it after navigation.
    navLinks.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeNav();
    });

    // Escape closes the menu and returns focus to the button.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Clicking outside closes it.
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') && !nav.contains(event.target)) closeNav();
    });
  }

  /* ---- 2. Reveal on scroll -------------------------------------------------
     The `.js` class is only added when IntersectionObserver exists, so content
     never stays hidden if the observer is unavailable.

     Two safeguards matter here. First, anything already on screen — including
     after a deep link to an anchor or a print preview — is revealed
     immediately rather than waiting for a scroll event that may never come.
     Second, the reveal is driven by viewport position, not by scroll events,
     so a full-page capture renders every section. */
  const revealables = document.querySelectorAll('.rise');

  // Escape hatch: ?static reveals every section at once and skips the
  // animation entirely. Use it for social cards, headless screenshots and
  // any renderer that captures the page without scrolling it.
  const isStatic = new URLSearchParams(location.search).has('static');

  if (revealables.length && 'IntersectionObserver' in window && !isStatic) {
    document.documentElement.classList.add('js');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealables.forEach((el, index) => {
      // Stagger in reading order, three at a time.
      el.style.transitionDelay = `${(index % 3) * 0.1}s`;
      observer.observe(el);
    });

    // Reveal anything already within the viewport. Called on load, on resize
    // (deep links, orientation changes, print preview) and shortly after, so
    // no section can be left stranded invisible.
    const revealOnScreen = () => {
      const limit = window.innerHeight;
      revealables.forEach((el) => {
        if (el.classList.contains('in')) return;
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('in');
          observer.unobserve(el);
        }
      });
    };

    revealOnScreen();
    window.addEventListener('resize', revealOnScreen);
    window.addEventListener('load', revealOnScreen);
    window.addEventListener('scroll', revealOnScreen, { passive: true });
    setTimeout(revealOnScreen, 300);
  } else if (revealables.length) {
    // No animation available or explicitly disabled: show everything.
    revealables.forEach((el) => el.classList.add('in'));
  }

  /* ---- 3. Booking form -----------------------------------------------------
     Client-side validation with an inline, announced status. Replace the
     simulated submit with a real fetch() to your own endpoint. */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    const setStatus = (message, ok = false) => {
      status.textContent = message;
      status.classList.toggle('ok', ok);
      status.classList.toggle('bad', !ok);
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.elements.name;
      const phone = form.elements.phone;

      if (!name.value.trim()) {
        setStatus('Please tell us your name.', false);
        name.focus();
        return;
      }

      // Loose check: enough digits to be a phone number, nothing more.
      const digits = phone.value.replace(/\D/g, '');
      if (digits.length < 10) {
        setStatus('That phone number looks incomplete.', false);
        phone.focus();
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      setStatus('Sending…');

      try {
        // Wire this to your endpoint:
        //   await fetch('/api/bookings', { method: 'POST', body: new FormData(form) });
        await new Promise((resolve) => setTimeout(resolve, 500));
        form.reset();
        setStatus('Thanks — we will call you back within one business hour.', true);
      } catch {
        setStatus('Could not send that. Please phone us on (503) 555-0142.', false);
      } finally {
        submit.disabled = false;
      }
    });
  }

  /* ---- 4. Phone links ------------------------------------------------------
     Normalise the number so it dials cleanly on mobile. Accepts either a bare
     10-digit number or one that already carries a country code. */
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    const digits = link.getAttribute('href').replace(/\D/g, '');
    if (!digits) return;
    // 11 digits starting with 1 is already in international form.
    const international = digits.length === 11 && digits.startsWith('1')
      ? `+${digits}`
      : `+1${digits}`;
    link.setAttribute('href', `tel:${international}`);
  });
})();
