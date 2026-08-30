// ===== Utilities =====
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// ===== Hero video: poster first, then a small DFW loop when appropriate =====
const heroVideo = qs('.hero-video');
if (heroVideo) {
  const source = heroVideo.querySelector('source[data-src]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let heroLoaded = false;

  const playHero = () => {
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
  };

  const loadHero = () => {
    if (heroLoaded || !source || prefersReducedMotion || saveData) return;
    heroLoaded = true;
    source.src = source.dataset.src || '';
    heroVideo.load();
    heroVideo.addEventListener('canplay', playHero, { once: true });
  };

  const queueHeroLoad = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(loadHero, { timeout: 2000 });
    else loadHero();
  };

  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
    window.addEventListener(eventName, queueHeroLoad, { once: true, passive: true });
  });

  window.addEventListener('load', () => {
    window.setTimeout(queueHeroLoad, 15000);
  }, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && heroLoaded && heroVideo.paused) playHero();
  });
}

// Set these to enable direct call/WhatsApp buttons.
const CONTACT_PHONE_E164 = '+18329389570';
const WHATSAPP_PHONE_E164 = '18329389570';

// ===== Navbar =====
const navbar = qs('#navbar');
const navToggle = qs('#nav-toggle');
const navMenu = qs('#nav-menu');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t) return;
    if (!navMenu.classList.contains('active')) return;
    if (navMenu.contains(t) || navToggle.contains(t)) return;
    closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

const navLinks = qsa('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ===== Active nav link on scroll =====
const aosEls = qsa('[data-aos]');
if (aosEls.length) {
  const aosObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.getAttribute('data-aos-delay') || 0);
        window.setTimeout(() => {
          el.classList.add('aos-animate');
        }, Math.max(0, delay));
        obs.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );
  aosEls.forEach((el) => aosObserver.observe(el));
}

const sections = qsa('section[id]');
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        else link.classList.remove('active');
      });
    });
  },
  { rootMargin: '-45% 0px -55% 0px' }
);
sections.forEach((section) => activeObserver.observe(section));

// ===== Counter animation =====
const counters = qsa('.stat-number');
let countersRun = false;

function animateCounter(el) {
  const target = Number(el.dataset.target || el.getAttribute('data-target') || 0);
  const duration = 1200;
  const start = performance.now();
  const startValue = Number(el.textContent || 0);

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (countersRun) return;
    if (entries.some((e) => e.isIntersecting)) {
      countersRun = true;
      counters.forEach((el) => animateCounter(el));
      counterObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);
counters.forEach((el) => counterObserver.observe(el));

// ===== Portfolio filtering =====
const filterButtons = qsa('.filter-btn');
const portfolioItems = qsa('.portfolio-item');

function applyFilter(category) {
  portfolioItems.forEach((item) => {
    const cat = item.dataset.category;
    const show = category === 'all' || cat === category;
    item.style.display = show ? 'block' : 'none';
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter || 'all');
  });
});

// ===== Portfolio modal =====
function buildPortfolioModal() {
  const modal = document.createElement('div');
  modal.id = 'portfolio-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <button class="modal-close" type="button" aria-label="Close" data-close="true">x</button>
      <img class="modal-img" id="modal-img" alt="" loading="lazy" />
      <div class="modal-meta">
        <div class="modal-tag" id="modal-tag"></div>
        <h3 id="modal-title"></h3>
        <p id="modal-desc"></p>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden', 'true');
  document.body.appendChild(modal);
  return modal;
}

const modal = buildPortfolioModal();
const modalImg = qs('#modal-img');
const modalTag = qs('#modal-tag');
const modalTitle = qs('#modal-title');
const modalDesc = qs('#modal-desc');
const modalCloseBtn = modal?.querySelector('.modal-close');
let lastFocusedEl = null;

function openModal(data) {
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modalImg.src = data.image || '';
  modalImg.alt = data.title || 'Project image';
  modalImg.style.display = data.image ? 'block' : 'none';
  modalTag.textContent = data.tag || '';
  modalTag.style.display = data.tag ? 'inline-block' : 'none';
  modalTitle.textContent = data.title || '';
  modalDesc.textContent = data.desc || '';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (modalCloseBtn) modalCloseBtn.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
}

modal.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.dataset && target.dataset.close === 'true') closeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
  const focusable = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter((el) => !el.disabled && el.getAttribute('aria-hidden') !== 'true');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

portfolioItems.forEach((item) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('click', () => {
    const title = item.dataset.title || item.querySelector('h3')?.textContent?.trim() || 'Project';
    const desc = item.dataset.desc || item.querySelector('p')?.textContent?.trim() || '';
    const tag = item.dataset.tag || item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
    const image = item.dataset.image || '';
    openModal({ title, desc, tag, image });
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const title = item.dataset.title || item.querySelector('h3')?.textContent?.trim() || 'Project';
      const desc = item.dataset.desc || item.querySelector('p')?.textContent?.trim() || '';
      const tag = item.dataset.tag || item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
      const image = item.dataset.image || '';
      openModal({ title, desc, tag, image });
    }
  });
});

// ===== Attribution, contact form and conversion tracking =====
function pushTrackingEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  // Send the same event to the direct GA4 installation when it is available.
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
}

const ATTRIBUTION_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid'
];

function readStoredJson(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || 'null');
  } catch (_) {
    return null;
  }
}

function writeStoredJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // Attribution should never block a quote request.
  }
}

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const current = {
    landing_page: window.location.href,
    referrer: document.referrer || 'direct'
  };
  ATTRIBUTION_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) current[key] = value.slice(0, 300);
  });

  let firstTouch = readStoredJson('aps_first_touch_v1');
  if (!firstTouch) {
    firstTouch = current;
    writeStoredJson('aps_first_touch_v1', firstTouch);
  }

  const previousLastTouch = readStoredJson('aps_last_touch_v1');
  const hasCampaignSignal = ATTRIBUTION_KEYS.some((key) => Boolean(current[key]));
  let hasExternalReferrer = false;
  try {
    hasExternalReferrer = Boolean(document.referrer) && new URL(document.referrer).origin !== window.location.origin;
  } catch (_) {
    hasExternalReferrer = false;
  }

  // Preserve the latest attributable entry across internal navigation, while
  // allowing a new campaign or external referral to replace an older touch.
  const lastTouch = (hasCampaignSignal || hasExternalReferrer || !previousLastTouch)
    ? current
    : previousLastTouch;
  writeStoredJson('aps_last_touch_v1', lastTouch);
  return lastTouch;
}

function populateAttributionFields() {
  const lastTouch = captureAttribution();
  const currentParams = new URLSearchParams(window.location.search);
  const currentCampaign = {};
  ATTRIBUTION_KEYS.forEach((key) => {
    const value = currentParams.get(key);
    if (value) currentCampaign[key] = value.slice(0, 300);
  });
  const hasCurrentCampaign = Object.keys(currentCampaign).length > 0;
  const values = {
    'landing-page': hasCurrentCampaign ? window.location.href : (lastTouch.landing_page || window.location.href),
    'lead-referrer': lastTouch.referrer || 'direct',
    'utm-source': currentCampaign.utm_source || lastTouch.utm_source || '',
    'utm-medium': currentCampaign.utm_medium || lastTouch.utm_medium || '',
    'utm-campaign': currentCampaign.utm_campaign || lastTouch.utm_campaign || '',
    'utm-content': currentCampaign.utm_content || lastTouch.utm_content || '',
    'utm-term': currentCampaign.utm_term || lastTouch.utm_term || '',
    gclid: currentCampaign.gclid || lastTouch.gclid || '',
    gbraid: currentCampaign.gbraid || lastTouch.gbraid || '',
    wbraid: currentCampaign.wbraid || lastTouch.wbraid || '',
    fbclid: currentCampaign.fbclid || lastTouch.fbclid || '',
    ttclid: currentCampaign.ttclid || lastTouch.ttclid || ''
  };
  Object.entries(values).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

const contactForm = qs('#contact-form');
if (contactForm) {
  populateAttributionFields();
  const shootDate = qs('#shoot-date');
  if (shootDate) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    shootDate.min = localDate.toISOString().slice(0, 10);
  }

  let formStarted = false;
  contactForm.addEventListener('focusin', () => {
    if (formStarted) return;
    formStarted = true;
    pushTrackingEvent('form_start', { form_name: 'website_quote', page_location: window.location.href });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const status = qs('#form-status');
    const originalHtml = submitBtn?.innerHTML || '';
    const formData = new FormData(contactForm);
    const honeypot = (formData.get('website') || '').toString();

    if (honeypot.trim()) {
      if (status) status.textContent = 'Please call or text us if you need help submitting this request.';
      return;
    }

    const service = (formData.get('service') || 'other').toString();
    const projectLocation = (formData.get('project_location') || 'DFW').toString().slice(0, 120);
    const subject = contactForm.querySelector('input[name="_subject"]');
    if (subject) subject.value = `[APS LEAD] ${service} | ${projectLocation}`;
    populateAttributionFields();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending request...';
    }
    if (status) status.textContent = 'Sending your request securely...';

    pushTrackingEvent('form_submit', {
      form_name: 'website_quote',
      service
    });

    const action = (contactForm.action || '').trim();
    let succeeded = false;
    try {
      if (!action.includes('formspree.io')) throw new Error('Form endpoint unavailable');
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Form submission failed');

      succeeded = true;
      pushTrackingEvent('generate_lead', {
        form_name: 'website_quote',
        service
      });
      if (status) status.textContent = 'Request received. Opening your confirmation page...';
      if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i> Request received';

      const successUrl = contactForm.dataset.successUrl || 'thank-you.html';
      window.setTimeout(() => {
        window.location.assign(new URL(successUrl, document.baseURI).href);
      }, 500);
    } catch (_) {
      if (status) {
        status.innerHTML = 'We could not send the form. Please <a href="tel:+18329389570">call</a> or <a href="sms:+18329389570">text (832) 938-9570</a>.';
      }
      pushTrackingEvent('form_error', { form_name: 'website_quote', service });
    } finally {
      if (!succeeded && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
    }
  });
}

function setupQuickContactButtons() {
  const callBtn = qs('#quick-call');
  const textBtn = qs('#quick-text');
  const whatsappBtn = qs('#quick-whatsapp');

  if (callBtn && CONTACT_PHONE_E164) {
    callBtn.href = `tel:${CONTACT_PHONE_E164}`;
  }

  if (textBtn && CONTACT_PHONE_E164) {
    textBtn.href = `sms:${CONTACT_PHONE_E164}`;
  }

  if (whatsappBtn && WHATSAPP_PHONE_E164) {
    const message = encodeURIComponent('Hi APS Drone, I need a quote for a DFW project.');
    whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE_E164}?text=${message}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
  }
}

qsa('[data-track]').forEach((el) => {
  el.addEventListener('click', () => {
    const placement = el.getAttribute('data-track') || 'unknown';
    let eventName = 'cta_click';
    if (placement.includes('whatsapp')) eventName = 'click_whatsapp';
    else if (placement.includes('text')) eventName = 'click_text';
    else if (placement.includes('call')) eventName = 'click_call';
    else if (placement.includes('email')) eventName = 'click_email';
    else if (placement.includes('quote')) eventName = 'click_quote';
    pushTrackingEvent(eventName, { placement, page_location: window.location.href });
  });
});

setupQuickContactButtons();

