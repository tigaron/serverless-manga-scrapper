import axios from "axios";
import * as cheerio from "cheerio";

const fetchMangaPage = async (url, needBypass) => {
    const options = needBypass
        ? {
            method: "POST",
            url: process.env.API_URL,
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.API_KEY,
                "X-RapidAPI-Host": process.env.API_HOST
            },
            data: { url }
        }
        : {
            method: "GET",
            url
        };
    try {
        const response = await axios.request(options);
        if (needBypass && response.data.info.statusCode !== 200) {
            return {
                response: {
                    status: response.data.info.statusCode,
                    statusText: "Cannot get that data"
                }
            }
        }
        const data = needBypass
            ? response.data.body
            : response.data;
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
            item.url = $(element).attr("href");
            item.slug = item.url.split("/").slice(-2).shift();
            result.chapters.push(item);
        };
        return result;
    } catch (error) {
        return error;
    }
}

export default fetchMangaPage;
