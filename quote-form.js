(function () {
  'use strict';

  function track(eventName, payload) {
    const details = payload || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, details));
    if (typeof window.gtag === 'function') window.gtag('event', eventName, details);
  }

  const attributionKeys = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid'
  ];

  function readJson(key) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null'); }
    catch (_) { return null; }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (_) { /* Attribution must never block a quote request. */ }
  }

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    const current = {
      landing_page: window.location.href,
      referrer: document.referrer || 'direct'
    };
    attributionKeys.forEach(function (key) {
      const value = params.get(key);
      if (value) current[key] = value.slice(0, 300);
    });

    let firstTouch = readJson('aps_first_touch_v1');
    if (!firstTouch) {
      firstTouch = current;
      writeJson('aps_first_touch_v1', firstTouch);
    }
    writeJson('aps_last_touch_v1', current);
    return firstTouch;
  }

  function populateAttributionFields() {
    const firstTouch = captureAttribution();
    const values = {
      'landing-page': firstTouch.landing_page || window.location.href,
      'lead-referrer': firstTouch.referrer || 'direct',
      'utm-source': firstTouch.utm_source || '',
      'utm-medium': firstTouch.utm_medium || '',
      'utm-campaign': firstTouch.utm_campaign || '',
      'utm-content': firstTouch.utm_content || '',
      'utm-term': firstTouch.utm_term || '',
      gclid: firstTouch.gclid || '',
      gbraid: firstTouch.gbraid || '',
      wbraid: firstTouch.wbraid || '',
      fbclid: firstTouch.fbclid || '',
      ttclid: firstTouch.ttclid || ''
    };
    Object.keys(values).forEach(function (id) {
      const field = document.getElementById(id);
      if (field) field.value = values[id];
    });
  }

  const form = document.getElementById('contact-form');
  if (!form) return;

  populateAttributionFields();
  const shootDate = document.getElementById('shoot-date');
  if (shootDate) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    shootDate.min = localDate.toISOString().slice(0, 10);
  }

  let formStarted = false;
  form.addEventListener('focusin', function () {
    if (formStarted) return;
    formStarted = true;
    track('form_start', { form_name: 'website_quote', page_location: window.location.href });
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById('form-status');
    const originalText = submitButton ? submitButton.textContent : '';
    const initialData = new FormData(form);
    const honeypot = String(initialData.get('website') || '');

    if (honeypot.trim()) {
      if (status) status.textContent = 'Please call or text us if you need help submitting this request.';
      return;
    }

    const service = String(initialData.get('service') || 'other');
    const projectLocation = String(initialData.get('project_location') || 'DFW').slice(0, 120);
    const subject = form.querySelector('input[name="_subject"]');
    if (subject) subject.value = '[APS LEAD] ' + service + ' | ' + projectLocation;
    populateAttributionFields();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending request...';
    }
    if (status) status.textContent = 'Sending your request securely...';
    track('form_submit', { form_name: 'website_quote', service: service });

    let succeeded = false;
    try {
      if (!form.action.includes('formspree.io')) throw new Error('Form endpoint unavailable');
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');

      succeeded = true;
      track('generate_lead', { form_name: 'website_quote', service: service });
      if (status) status.textContent = 'Request received. Opening your confirmation page...';
      if (submitButton) submitButton.textContent = 'Request received';
      const successUrl = form.dataset.successUrl || '../thank-you.html';
      window.setTimeout(function () {
        window.location.assign(new URL(successUrl, document.baseURI).href);
      }, 500);
    } catch (_) {
      if (status) {
        status.innerHTML = 'We could not send the form. Please <a href="tel:+18329389570">call</a> or <a href="sms:+18329389570">text (832) 938-9570</a>.';
      }
      track('form_error', { form_name: 'website_quote', service: service });
    } finally {
      if (!succeeded && submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
})();
