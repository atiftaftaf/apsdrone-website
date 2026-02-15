// ===== Utilities =====
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// Set these to enable direct call/WhatsApp buttons.
const CONTACT_PHONE_E164 = '+18329389570';
const WHATSAPP_PHONE_E164 = '18329389570';

// ===== Navbar =====
const navbar = qs('#navbar');
const navToggle = qs('#nav-toggle');
const navMenu = qs('#nav-menu');
const heroVideo = qs('.hero-video');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  if (heroVideo) {
    const fade = Math.max(0, 1 - (window.scrollY / 360));
    heroVideo.style.opacity = fade.toString();
  }
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

function renderPortfolioThumbnails() {
  portfolioItems.forEach((item) => {
    const src = item.dataset.image || '';
    if (!src) return;
    const frame = item.querySelector('.portfolio-image');
    if (!frame) return;
    const title = item.querySelector('h4')?.textContent?.trim() || 'Project image';
    frame.innerHTML = `<img src="${src}" alt="${title}" loading="lazy">`;
  });
}

renderPortfolioThumbnails();

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
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-label="Project preview">
      <button class="modal-close" type="button" aria-label="Close" data-close="true">x</button>
      <img class="modal-img" id="modal-img" alt="" loading="lazy" />
      <div class="modal-meta">
        <div class="modal-tag" id="modal-tag"></div>
        <h3 id="modal-title"></h3>
        <p id="modal-desc"></p>
      </div>
    </div>
  `;
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
});

portfolioItems.forEach((item) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('click', () => {
    const title = item.querySelector('h4')?.textContent?.trim() || 'Project';
    const desc = item.querySelector('p')?.textContent?.trim() || '';
    const tag = item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
    const image = item.dataset.image || '';
    openModal({ title, desc, tag, image });
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const title = item.querySelector('h4')?.textContent?.trim() || 'Project';
      const desc = item.querySelector('p')?.textContent?.trim() || '';
      const tag = item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
      const image = item.dataset.image || '';
      openModal({ title, desc, tag, image });
    }
  });
});

// ===== Contact form =====
const contactForm = qs('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const formData = new FormData(contactForm);
    const honeypot = (formData.get('company') || '').toString();
    if (honeypot.trim()) return;
    const name = (formData.get('name') || '').toString();
    const email = (formData.get('email') || '').toString();
    const phone = (formData.get('phone') || '').toString();
    const service = (formData.get('service') || '').toString();
    const message = (formData.get('message') || '').toString();
    const action = (contactForm.action || '').trim();

    const fallbackMailto = () => {
      const to = 'setenaytaftaf@gmail.com';
      const subject = 'APS Drone quote request';
      const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`;
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    };

    try {
      const isFormspree = action.includes('formspree.io') && !action.includes('placeholder');

      if (!isFormspree) {
        fallbackMailto();
        return;
      }

      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) throw new Error('Failed');

      contactForm.reset();
      if (submitBtn) submitBtn.textContent = 'Sent';
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 2500);
    } catch (err) {
      if (submitBtn) submitBtn.textContent = 'Try again';
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 2000);
    }
  });
}

// ===== Media showcase =====
const mediaGrid = qs('#media-grid');

const mediaItems = [
  {
    type: 'image',
    title: 'Houston Real Estate Exterior',
    subtitle: 'Residential property context and lot visibility.',
    src: 'assets/media/real-estate-houston-01.jpg',
    alt: 'Real estate drone photo in Houston, Texas'
  },
  {
    type: 'image',
    title: 'Houston Property Context View',
    subtitle: 'Wider neighborhood perspective for listing appeal.',
    src: 'assets/media/real-estate-houston-02.jpg',
    alt: 'Aerial neighborhood context for a Houston property'
  },
  {
    type: 'image',
    title: 'Houston Roofline and Access View',
    subtitle: 'Angle showing access, roof lines, and boundaries.',
    src: 'assets/media/real-estate-houston-03.jpg',
    alt: 'Aerial property roofline and access view in Houston'
  },
  {
    type: 'image',
    title: 'Vitruvian Salsa Festival - Addison, TX',
    subtitle: 'Crowd and venue energy from above.',
    src: 'assets/media/salsa-vitruvian-addison.jpg',
    alt: 'Aerial coverage of salsa festival at Vitruvian Park in Addison'
  },
  {
    type: 'image',
    title: 'Thermal Inspection - Urban Site',
    subtitle: 'Thermal capture used for inspection review.',
    src: 'assets/media/thermal-inspection-urban.jpg',
    alt: 'Thermal drone inspection image from urban site'
  },
  {
    type: 'image',
    title: 'Thermal Inspection - Site Frame A',
    subtitle: 'Detailed thermal image for hotspot analysis.',
    src: 'assets/media/thermal-site-01.jpg',
    alt: 'Thermal drone image for site inspection'
  },
  {
    type: 'image',
    title: 'Thermal Inspection - Site Frame B',
    subtitle: 'Secondary thermal capture from same project area.',
    src: 'assets/media/thermal-site-02.jpg',
    alt: 'Second thermal drone inspection frame'
  },
  {
    type: 'video',
    title: 'FPV Tour - Club Pilates, Cross Roads TX',
    subtitle: 'Indoor FPV fly-through recorded with DJI Avata.',
    src: 'assets/media/fpv-club-pilates-crossroads.mp4',
    poster: 'assets/media/thermal-site-01.jpg'
  },
  {
    type: 'image',
    title: 'Discovery Green - Houston, TX',
    subtitle: 'Downtown park atmosphere with surrounding city context.',
    src: 'assets/media/DJI_0537.JPG',
    alt: 'Aerial photo of Discovery Green in Houston, Texas'
  },
  {
    type: 'image',
    title: 'Hero Reel Preview',
    subtitle: 'High-altitude cinematic pass used in hero section.',
    src: 'assets/media/DJI_0608.JPG',
    alt: 'Cinematic drone still from hero reel'
  }
];

function renderMediaGrid() {
  if (!mediaGrid) return;

  mediaGrid.innerHTML = mediaItems.map((item) => `
    <article class="media-card">
      <div class="media-frame">
        ${item.type === 'video'
          ? `<video controls preload="metadata" poster="${item.poster || ''}"><source src="${item.src}" type="video/mp4">Your browser does not support HTML5 video.</video>`
          : `<img src="${item.src}" alt="${item.alt}" loading="lazy">`
        }
      </div>
      <div class="media-meta">
        <h3>${item.title}</h3>
        ${item.subtitle ? `<p>${item.subtitle}</p>` : ''}
      </div>
    </article>
  `).join('');
}

renderMediaGrid();

// ===== Quick contact + tracking =====
function pushTrackingEvent(eventName, payload = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

function setupQuickContactButtons() {
  const callBtn = qs('#quick-call');
  const whatsappBtn = qs('#quick-whatsapp');

  if (callBtn && CONTACT_PHONE_E164) {
    callBtn.href = `tel:${CONTACT_PHONE_E164}`;
  }

  if (whatsappBtn && WHATSAPP_PHONE_E164) {
    whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE_E164}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
  }
}

qsa('[data-track]').forEach((el) => {
  el.addEventListener('click', () => {
    const source = el.getAttribute('data-track') || 'unknown';
    pushTrackingEvent('lead_click', { source });
  });
});

setupQuickContactButtons();

