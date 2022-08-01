import axios from "axios";
import * as cheerio from "cheerio";

const fetchListPage = async (url, needBypass, isAsura) => {
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
        const data = needBypass
            ? response.data.body
            : response.data;
        const $ = cheerio.load(data);
        const result = [];
        for (const element of $("a.series", "div.soralist", data)) {
            const item = {};
            item.title = $(element).text().trim() + "";
            item.url = $(element).attr("href");
            item.slug = isAsura
                ? item.url.split("/").slice(-3, -1).join("+")
                : item.url.split("/").slice(-2).shift();
            result.push(item);
        };
        return result;
    } catch (error) {
        return error;
    }
}

export default fetchListPage;
