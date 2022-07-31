import express from "express";
import { fetchListPage, fetchMangaPage, fetchChapterPage } from "../utils/index.js";

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
    }
};

const bypassList = [
    "alpha",
    "asura",
];

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
        return res.status(400).json({
            message: `${source} is not available for scraping`
        });
    }
    const needBypass = bypassList.includes(source);
    try {
        const response = await fetchListPage(
            Object.values(urlList[source]).join("/") + "/list-mode/",
            needBypass
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/manga/:source/:slug", async (req, res) => {
    const { source, slug } = req.params;
    if (!(source in urlList)) {
        return res.status(400).json({
            message: `${source} is not available for scraping`
        });
    }
    const needBypass = bypassList.includes(source);
    try {
        const response = await fetchMangaPage(
            Object.values(urlList[source]).join("/") + `/${slug}/`,
            needBypass
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/chapter/:source/:slug", async (req, res) => {
    const { source, slug } = req.params;
    if (!(source in urlList)) {
        return res.status(400).json({
            message: `${source} is not available for scraping`
        });
    }
    const needBypass = bypassList.includes(source);
    try {
        const response = await fetchChapterPage(
            urlList[source].base + `/${slug}/`,
            needBypass
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default router;
