const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch({
    args: [ '--use-fake-ui-for-media-stream' ]
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/service');

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  //await browser.close();
})();