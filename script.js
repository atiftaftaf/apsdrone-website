// ===== Utilities =====
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// ===== Hero video playlist =====
const heroVideo = qs('.hero-video');
const heroPlaylist = [
  'assets/media/hero-loop-01.mp4',
  'assets/media/hero-loop-02.mp4',
  'assets/media/hero-loop-03.mp4',
  'assets/media/hero-loop-04.mp4',
  'assets/media/hero-loop-05.mp4',
  'assets/media/hero-loop-06.mp4',
  'assets/media/hero-loop-07.mp4',
  'assets/media/hero-loop-08.mp4',
  'assets/media/hero-loop-09.mp4',
  'assets/media/hero-loop-10.mp4'
];

function setupHeroVideoPlaylist() {
  if (!heroVideo || !heroPlaylist.length) return;
  let idx = 0;

  const playAt = (i) => {
    idx = (i + heroPlaylist.length) % heroPlaylist.length;
    heroVideo.src = heroPlaylist[idx];
    heroVideo.load();
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  heroVideo.addEventListener('ended', () => playAt(idx + 1));
  heroVideo.addEventListener('error', () => playAt(idx + 1));
  playAt(0);
}

setupHeroVideoPlaylist();

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
    const title = item.dataset.title || item.querySelector('h4')?.textContent?.trim() || 'Project';
    const desc = item.dataset.desc || item.querySelector('p')?.textContent?.trim() || '';
    const tag = item.dataset.tag || item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
    const image = item.dataset.image || '';
    openModal({ title, desc, tag, image });
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const title = item.dataset.title || item.querySelector('h4')?.textContent?.trim() || 'Project';
      const desc = item.dataset.desc || item.querySelector('p')?.textContent?.trim() || '';
      const tag = item.dataset.tag || item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
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

    try {
      const isFormspree = action.includes('formspree.io') && !action.includes('placeholder');

      if (!isFormspree) {
        throw new Error('Form endpoint missing');
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
    title: 'Aerial View of New Homes',
    subtitle: 'Capturing the development of a residential area',
    src: 'assets/media/real-estate-houston-02.jpg',
    alt: 'Drone view showing new houses and roads'
  },
  {
    type: 'image',
    title: 'Stunning Residential Property',
    subtitle: 'High-quality aerial view of a new home',
    src: 'assets/media/real-estate-houston-03.jpg',
    alt: 'Aerial image of a modern house with greenery'
  },
  {
    type: 'image',
    title: 'Thermal Roof Inspection',
    subtitle: 'Assessing roof conditions with thermal imaging technology',
    src: 'assets/media/thermal-site-02.jpg',
    alt: 'Thermal image of a roof for inspection purposes'
  },
  {
    type: 'image',
    title: 'Drone View of City Skyline',
    subtitle: 'Capturing stunning views of urban landscapes from above',
    src: 'assets/media/thermal-inspection-urban.jpg',
    alt: 'Aerial view of tall buildings in an urban skyline'
  },
  {
    type: 'image',
    title: 'Commercial Aerial Overview',
    subtitle: 'Wide framing for commercial property context',
    src: 'assets/media/DJI_0046.JPG',
    alt: 'Aerial shot of a commercial area'
  },
  {
    type: 'image',
    title: 'Paris, TX Eiffel Tower View',
    subtitle: 'Aerial capture of the Eiffel Tower landmark in Paris, Texas',
    src: 'assets/media/DJI_0203.JPG',
    alt: 'Aerial view of the Eiffel Tower landmark in Paris, Texas'
  },
  {
    type: 'image',
    title: 'Urban Property Perspective',
    subtitle: 'Top-down framing for marketing and planning use',
    src: 'assets/media/DJI_0359.JPG',
    alt: 'Aerial perspective of urban properties'
  },
  {
    type: 'video',
    title: 'FPV Indoor Tour (DJI Avata)',
    subtitle: 'Indoor cinematic FPV fly-through for business marketing.',
    src: 'assets/media/fpv-club-pilates-crossroads.mp4',
    poster: 'assets/media/fpv-club-pilates-crossroads-poster.jpg'
  },
  {
    type: 'image',
    title: 'Phoenix Botanical Garden View',
    subtitle: 'Aerial perspective over botanical garden landscapes in Phoenix',
    src: 'assets/media/DJI_0491.JPG',
    alt: 'Aerial view of botanical garden grounds in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'Desert Roadway Aerial View',
    subtitle: 'Wide aerial framing of road and desert surroundings',
    src: 'assets/media/DJI_0500.JPG',
    alt: 'Aerial view of a roadway through desert terrain'
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

