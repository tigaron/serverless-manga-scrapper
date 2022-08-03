import chromium from "@sparticuz/chrome-aws-lambda";
import logger from "./logger.js";

const crawler = async (url) => {
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true
    });
    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const shouldAbort =
            request.resourceType() === "script"
            || request.resourceType() === "font"
            || request.resourceType() === "image"
            || request.resourceType() === "xhr"
            || request.resourceType() === "stylesheet"
            || request.resourceType() === "media";
            if (shouldAbort) request.abort();
            else request.continue();
        });
        logger.info(`Start crawling '${url}'`);
        const response = await page.goto(url, { waitUntil: "domcontentloaded" });
        if (response.ok()) {
            logger.info(`Crawl success!`);
            const content = await page.content();
            return content;
        } else {
            logger.warn(`Crawl failed!`);
            const title = await page.title();
            const exception = {
                error: `Failed to fetch '${url}'`,
                status: response.status(),
                message: title
            };
            return exception;
        }
    } catch (error) {
        return error;
    } finally {
        await browser.close();
    }
};

export default crawler;
