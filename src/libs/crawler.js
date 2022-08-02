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
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const content = await page.content();
        return content;
    } catch (error) {
        console.log(error)
        return error;
    } finally {
        await browser.close();
    }
};

export default crawler;
