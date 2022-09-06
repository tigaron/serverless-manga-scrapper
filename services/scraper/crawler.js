const chromium = require('@sparticuz/chrome-aws-lambda');
const logger = require('logger');

async function crawler (urlString) {
  let browser = null;
  try {
    logger.debug(`In crawler`);
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    logger.debug(`Launched browser instance`);
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      if (interceptedRequest.resourceType() !== 'document') interceptedRequest.abort();
      else interceptedRequest.continue();
    });
    logger.debug(`Configured page interceptor`);
    const response = await page.goto(urlString, { waitUntil: 'domcontentloaded' });
    if (!response.ok()) throw new Error(`No OK response from "${urlString}"`);
    const result = await page.content();
    return result;
  } catch (error) {
    logger.error(`crawler failed: `, error.message);
    throw error.message;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = crawler;
