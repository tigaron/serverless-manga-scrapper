import axios from "axios";
import * as cheerio from "cheerio";

const fetchChapterPage = async (url, needBypass) => {
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
        result.img = [];
        for (const element of $("img[class*='wp-image']", "div#readerarea", data)) {
            result.img.push($(element).attr("src"));
        };
        return result;
    } catch (error) {
        return error;
    }
}

export default fetchChapterPage;
