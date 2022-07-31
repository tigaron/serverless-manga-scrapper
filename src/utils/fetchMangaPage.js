const axios = require("axios");
const cheerio = require("cheerio");

module.exports.fetchMangaPage = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = {};

        result.title = $("h1.entry-title", data).text().trim() + "";
        result.cover = $("img", "div.thumb", data).attr("src");
        result.synopsis = $("p", "div.entry-content", data).text();
        result.chapters = [];
        for (const element of $("a", "div.eplister", data)) {
            const item = {};
            item.title = $("span.chapternum", element).text();
            if (item.title.includes("\n")) {
                item.title = item.title.split("\n").slice(-2).join(" ");
            }
            item.url =  $(element).attr("href");
            item.slug = item.url.split("/").slice(-2).shift();
            result.chapters.push(item);
        };
        return result;
    } catch (error) {
        return error;
    }
}
