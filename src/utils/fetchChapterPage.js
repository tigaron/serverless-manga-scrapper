const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchChapterPage = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = {};

        result.title = $("h1.entry-title", data).text().trim() + "";
        result.img = [];
        for (const element of $("img[class*='wp-image']", "div#readerarea", data)) {
            result.img.push($(element).attr("src"));
        }
        return result;
    } catch (error) {
        return error;
    }
}
