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
    title: 'Musical Instrument Museum - Phoenix, AZ',
    subtitle: 'Architectural aerial perspective against the desert backdrop.',
    src: 'assets/media/DJI_0608.JPG',
    alt: 'Aerial view of Musical Instrument Museum in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'St. Martha Catholic Church - Porter, TX',
    subtitle: 'Aerial view highlighting church architecture and surroundings.',
    src: 'assets/media/DJI_0779.JPG',
    alt: 'Drone photo of St. Martha Catholic Church in Porter, Texas'
  },
  {
    type: 'image',
    title: 'Brady Townscape - Brady, TX',
    subtitle: 'Small-town layout and landmarks from above.',
    src: 'assets/media/DJI_0512.JPG',
    alt: 'Drone photo of Brady, Texas'
  },
  {
    type: 'image',
    title: 'Delta Hotels by Marriott - Phoenix Mesa, AZ',
    subtitle: 'Hotel property and surrounding urban context.',
    src: 'assets/media/DJI_0042.JPG',
    alt: 'Aerial view of Delta Hotels by Marriott in Phoenix Mesa, Arizona'
  },
  {
    type: 'image',
    title: 'Eiffel Tower Replica - Paris, TX',
    subtitle: 'Sweeping view including nearby memorial museum area.',
    src: 'assets/media/DJI_0203.JPG',
    alt: 'Drone photo of Eiffel Tower replica in Paris, Texas'
  },
  {
    type: 'image',
    title: 'Galveston Beach - Galveston, TX',
    subtitle: 'Expansive coastline and sea textures.',
    src: 'assets/media/DJI_0592.JPG',
    alt: 'Aerial photo of Galveston beach and sea'
  },
  {
    type: 'image',
    title: "L'Auberge Resort Lazy Pool - Lake Charles, LA",
    subtitle: 'Resort pool geometry and landscaping from above.',
    src: 'assets/media/DJI_0359.JPG',
    alt: "Aerial view of L'Auberge resort lazy pool in Lake Charles, Louisiana"
  },
  {
    type: 'image',
    title: 'Desert Botanical Garden - Phoenix, AZ',
    subtitle: 'Distinct desert landscaping and pathways captured aerially.',
    src: 'assets/media/DJI_0491.JPG',
    alt: 'Aerial photo of Desert Botanical Garden in Phoenix, Arizona'
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
    title: 'Phoenix Road Network - Phoenix, AZ',
    subtitle: 'Dynamic aerial composition of roads and neighborhoods.',
    src: 'assets/media/DJI_0965.JPG',
    alt: 'Drone photo of road network and neighborhoods in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'Phoenix Commercial View - Phoenix, AZ',
    subtitle: 'Commercial activity area with clear site layout.',
    src: 'assets/media/DJI_0046.JPG',
    alt: 'Aerial commercial view in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'Desert Road Scene - Phoenix, AZ',
    subtitle: 'Winding roadway through rugged desert terrain.',
    src: 'assets/media/DJI_0500.JPG',
    alt: 'Aerial desert road photo in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'Mountain Landscape - Phoenix, AZ',
    subtitle: 'Natural mountain backdrop near urban development.',
    src: 'assets/media/DJI_0967.JPG',
    alt: 'Aerial mountain landscape in Phoenix, Arizona'
  },
  {
    type: 'image',
    title: 'Cloudscape - Sugar Land, TX',
    subtitle: 'Expansive cloud formations and atmospheric depth.',
    src: 'assets/media/DJI_0631.JPG',
    alt: 'Aerial cloudscape in Sugar Land, Texas'
  }
];

function renderMediaGrid() {
  if (!mediaGrid) return;

  mediaGrid.innerHTML = mediaItems.map((item) => `
    <article class="media-card">
      <div class="media-frame">
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
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

