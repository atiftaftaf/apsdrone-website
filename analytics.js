(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-81SXN88RSB';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: true
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(tag);

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('data-track')) return;

    const href = link.getAttribute('href') || '';
    let eventName = '';
    if (href.startsWith('tel:')) eventName = 'click_call';
    else if (href.startsWith('sms:')) eventName = 'click_text';
    else if (href.startsWith('mailto:')) eventName = 'click_email';
    else if (href.includes('#contact')) eventName = 'click_quote';

    if (!eventName) return;
    window.gtag('event', eventName, {
      link_url: link.href,
      link_text: (link.textContent || '').trim().slice(0, 120),
      page_location: window.location.href
    });
  });
})();
