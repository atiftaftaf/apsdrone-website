const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function localStorageStub() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
}

function runAnalyticsChecks() {
  const listeners = new Map();
  const window = {
    location: {
      href: 'https://apsdrone.com/dallas-drone-services/',
      origin: 'https://apsdrone.com'
    }
  };
  const document = {
    addEventListener(name, handler) { listeners.set(name, handler); },
    createElement() { return {}; },
    head: { appendChild() {} }
  };
  const context = vm.createContext({ window, document, URL, encodeURIComponent });
  vm.runInContext(fs.readFileSync(path.join(root, 'analytics.js'), 'utf8'), context);

  const click = listeners.get('click');
  assert.equal(typeof click, 'function', 'analytics click listener should be installed');

  function fire(href, text, tracked) {
    const link = {
      href: new URL(href, window.location.href).href,
      getAttribute(name) { return name === 'href' ? href : null; },
      hasAttribute(name) { return name === 'data-track' && tracked; },
      textContent: text
    };
    click({ target: { closest() { return link; } } });
  }

  fire('tel:+18329389570', 'Call APS Drone', false);
  fire('/request-a-quote/', 'Request a quote', false);
  fire('/#contact', 'Check availability', false);
  fire('mailto:apsdronetx@gmail.com', 'Email APS Drone', true);

  const names = window.dataLayer
    .filter((entry) => entry && entry[0] === 'event')
    .map((entry) => entry[1]);
  assert.equal(
    JSON.stringify(names),
    JSON.stringify(['click_call', 'click_booking', 'click_quote'])
  );
}

function runBookingLandingChecks() {
  const fields = new Map();
  [
    'landing-page', 'lead-referrer', 'utm-source', 'utm-medium', 'utm-campaign',
    'utm-content', 'utm-term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid',
    'shoot-date'
  ].forEach((id) => fields.set(id, {
    id,
    value: '',
    setAttribute(name, value) { if (name === 'value') this.value = value; }
  }));

  const formListeners = new Map();
  const form = {
    action: 'https://formspree.io/f/mwvnoboy',
    dataset: {},
    addEventListener(name, handler) { formListeners.set(name, handler); },
    querySelector() { return null; }
  };
  const window = {
    APS_QUOTE_FORM_BUILD: '',
    dataLayer: [],
    localStorage: localStorageStub(),
    location: {
      href: 'https://apsdrone.com/request-a-quote/?utm_source=google_business_profile&utm_medium=organic&utm_campaign=booking',
      search: '?utm_source=google_business_profile&utm_medium=organic&utm_campaign=booking',
      pathname: '/request-a-quote/',
      origin: 'https://apsdrone.com'
    }
  };
  const document = {
    referrer: 'https://www.google.com/',
    baseURI: 'https://apsdrone.com/request-a-quote/',
    getElementById(id) { return id === 'contact-form' ? form : (fields.get(id) || null); }
  };
  const context = vm.createContext({
    window,
    document,
    URL,
    URLSearchParams,
    Date,
    FormData: class FormData {},
    fetch() { throw new Error('submit path must not run during initialization test'); }
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'quote-form-v2.js'), 'utf8'), context);

  const event = window.dataLayer.find((entry) => entry.event === 'booking_landing');
  assert.ok(event, 'booking_landing should be emitted on the dedicated quote route');
  assert.equal(event.traffic_source, 'google_business_profile');
  assert.equal(event.traffic_medium, 'organic');
  assert.equal(event.traffic_campaign, 'booking');
  assert.equal(fields.get('utm-source').value, 'google_business_profile');
  assert.equal(fields.get('utm-medium').value, 'organic');
  assert.equal(fields.get('utm-campaign').value, 'booking');
  assert.equal(form.dataset.attributionReady, 'true');
  assert.equal(typeof formListeners.get('submit'), 'function');
}

function runAttributedLandingPageChecks() {
  const campaigns = {
    'about-aps-drone': 'about_aps_drone',
    'dallas-drone-services': 'dallas_drone_services',
    'fort-worth-drone-services': 'fort_worth_drone_photography',
    'arlington-drone-services': 'arlington_drone_services',
    'real-estate-drone-photography-dallas': 'real_estate_drone_photography',
    'commercial-drone-photography-dfw': 'commercial_drone_services',
    'construction-progress-drone-dfw': 'construction_progress',
    'drone-photography-pricing-dallas': 'drone_photography_pricing',
    'dallas-drone-videography': 'dallas_drone_videographer',
    'dfw-commercial-drone-project-checklist': 'commercial_project_checklist',
    'dfw-real-estate-drone-shot-list': 'real_estate_shot_list',
    'aps-drone-media-credit-guide': 'media_credit_guidance',
    'dfw-residential-drone-video': 'residential_drone_video',
    'dfw-commercial-drone-video': 'commercial_drone_video',
    'dfw-fpv-business-tour-video': 'fpv_business_tour_video',
    'dfw-drone-roof-inspection': 'roof_documentation',
    'dfw-thermal-drone-inspection': 'thermal_drone_imaging',
    'dfw-fpv-drone-tours': 'fpv_drone_tours',
    'dfw-drone-project-case-studies': 'dfw_case_studies',
    'dfw-real-estate-vertical-drone-reel': 'real_estate_vertical_reel'
  };

  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/apsdrone\.com\/(.*?)<\/loc>/g)]
    .map((match) => match[1].replace(/\/$/, ''))
    .filter(Boolean)
    .sort();
  assert.deepEqual(
    Object.keys(campaigns).sort(),
    sitemapPaths,
    'every non-home sitemap page should have an attributed quote campaign'
  );

  for (const [slug, campaign] of Object.entries(campaigns)) {
    const html = fs.readFileSync(path.join(root, slug, 'index.html'), 'utf8');
    assert.ok(
      html.includes('request-a-quote/'),
      `${slug} should link to the dedicated quote route`
    );
    assert.ok(
      html.includes(`utm_campaign=${campaign}`),
      `${slug} should include its attributed campaign`
    );
    assert.doesNotMatch(
      html,
      /https:\/\/apsdrone\.com\/#contact|href="\.\.\/#contact"|href="\/#contact"/,
      `${slug} should not send quote intent back to a homepage fragment`
    );
  }

  const about = fs.readFileSync(path.join(root, 'about-aps-drone', 'index.html'), 'utf8');
  assert.doesNotMatch(
    about,
    /data-track="(?:quote|call|text|email)-about/,
    'About-page contact links must be handled by analytics.js instead of an unloaded data-track handler'
  );
}

runAnalyticsChecks();
runBookingLandingChecks();
runAttributedLandingPageChecks();
console.log('Conversion tracking verification passed.');
