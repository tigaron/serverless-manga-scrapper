import express from "express";
import scraper from "../libs/scraper.js";

const router = express.Router();

const urlList = {
    alpha: {
        base: "https://alpha-scans.org",
        slug: "manga"
    },
    asura: {
        base: "https://www.asurascans.com",
        slug: "manga"
    },
    flame: {
        base: "https://flamescans.org",
        slug: "series"
    },
    luminous: {
        base: "https://luminousscans.com",
        slug: "series"
    },
    realm: {
        base: "https://realmscans.com",
        slug: "series"
    }
};

router.get("/", async (req, res) => {
    res.redirect(301, "/scrape/list");
});

router.get("/list", async (req, res) => {
    res.status(200).json({
        "Available list for scraping:": Object.keys(urlList)
    });
});

router.get("/list/:source", async (req, res) => {
    const { source } = req.params;
    if (!(source in urlList)) {
        return res.status(404).json({
            error: `${source} is not available for scraping`
        });
    }
    try {
        const response = await scraper(
            Object.values(urlList[source]).join("/") + "/list-mode/",
            "list"
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/manga/:source/:slug", async (req, res) => {
    const { source, slug } = req.params;
    const parsedSlug = slug.split("+").join("/");
    if (!(source in urlList)) {
        return res.status(404).json({
            error: `${source} is not available for scraping`
        });
    }
    try {
        const response = await scraper(
            urlList[source].base + `/${parsedSlug}/`,
            "manga"
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/chapter/:source/:slug", async (req, res) => {
    const { source, slug } = req.params;
    if (!(source in urlList)) {
        return res.status(404).json({
            error: `${source} is not available for scraping`
        });
    }
    const isRealm = source === "realm" ? true : false;
    try {
        const response = await scraper(
            urlList[source].base + `/${slug}/`,
            "chapter",
            isRealm
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

export default router;
