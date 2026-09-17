// Open the site in playwright-cli, then run-code --filename scripts/verify_browser_layout.js.
async (page) => {
  const origin = page.url().split('/').slice(0, 3).join('/');
  const response = await page.request.get(origin + '/sitemap.xml');
  const paths = await page.evaluate(xml => {
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    return [...document.querySelectorAll('loc')].map(node => new URL(node.textContent).pathname);
  }, await response.text());
  paths.push('/request-a-quote/', '/privacy.html', '/thank-you.html', '/404.html', '/plano-drone-services/', '/frisco-drone-services/');
  const failures = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let checked = 0;
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(origin + path);
      const issues = await page.evaluate(async () => {
        const issues = [];
        const images = [...document.images].filter(img => img.getAttribute('src'));
        images.forEach(img => img.loading = 'eager');
        await Promise.all(images.map(img => img.decode().catch(() => {})));
        if (document.documentElement.scrollWidth > innerWidth + 2) issues.push('Horizontal overflow');
        for (const img of images) {
          if (!img.naturalWidth) issues.push('Broken image: ' + img.getAttribute('src'));
          if (!img.matches('.media-grid img, .portfolio-image img')) continue;
          const box = img.getBoundingClientRect();
          if (!box.width || !box.height) continue;
          const ratio = box.width / box.height / (img.naturalWidth / img.naturalHeight);
          if (Math.abs(ratio - 1) > .02 && getComputedStyle(img).objectFit !== 'contain') {
            issues.push('Cropped or stretched photo: ' + img.getAttribute('src'));
          }
        }
        return issues;
      });
      if (issues.length) failures.push({ path, width, issues });
      checked++;
    }
  }
  if (failures.length || errors.length) throw Error(JSON.stringify({ failures, errors }));
  return { pages: paths.length, viewports: 4, checked, failures, errors };
}
