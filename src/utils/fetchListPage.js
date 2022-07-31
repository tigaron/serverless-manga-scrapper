const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchListPage = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = [];
        for (const element of $("a.series", "div.soralist", data)) {
            const item = {};
            item.title = $(element).text().trim() + "";
            item.url =  $(element).attr("href");
            item.slug = item.url.split("/").slice(-2).shift();
            result.push(item);
        }
        return result;
    } catch (error) {
        return error;
    }
}
