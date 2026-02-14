// ===== Utilities =====
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

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
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

const navLinks = qsa('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
  });
});

// ===== Active nav link on scroll =====
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
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-label="Project preview">
      <button class="modal-close" type="button" aria-label="Close" data-close="true">✕</button>
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

function openModal(data) {
  if (!modal) return;
  modalImg.src = data.image || '';
  modalImg.alt = data.title || 'Project image';
  modalTag.textContent = data.tag || '';
  modalTag.style.display = data.tag ? 'inline-block' : 'none';
  modalTitle.textContent = data.title || '';
  modalDesc.textContent = data.desc || '';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.dataset && target.dataset.close === 'true') closeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

portfolioItems.forEach((item) => {
  item.addEventListener('click', () => {
    const title = item.querySelector('h4')?.textContent?.trim() || 'Project';
    const desc = item.querySelector('p')?.textContent?.trim() || '';
    const tag = item.querySelector('.portfolio-tag')?.textContent?.trim() || item.dataset.category || '';
    const image = item.dataset.image || '';
    openModal({ title, desc, tag, image });
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
    const name = (formData.get('name') || '').toString();
    const email = (formData.get('email') || '').toString();
    const service = (formData.get('service') || '').toString();
    const message = (formData.get('message') || '').toString();
    const action = (contactForm.action || '').trim();

    const fallbackMailto = () => {
      const to = 'info@apsdrone.com';
      const subject = 'APS Drone quote request';
      const body = `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`;
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
      if (submitBtn) submitBtn.textContent = 'Sent ✅';
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
