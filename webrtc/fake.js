const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--headless', '--no-sandbox', '--use-fake-ui-for-media-stream']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/service');

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  //await browser.close();
})();