const express = require("express");
const { fetchListPage } = require("../utils/fetchListPage.js");
const { fetchMangaPage } = require("../utils/fetchMangaPage.js");
const { fetchChapterPage } = require("../utils/fetchChapterPage.js");

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

router.get("/list", async (req, res) => {
    res.status(200).json({
        "Available list for scraping:": Object.keys(urlList)
    });
});

router.get("/list/:source", async (req, res) => {
    const requestedSource = req.params.source;
    
    if (!(requestedSource in urlList)) {
        return res.status(400).json({
            message: `${requestedSource} is not available for scraping`
        });
    }

    try {
        const response = await fetchListPage(
            Object.values(urlList[requestedSource]).join("/") + "/list-mode"
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/manga/:source/:slug", async (req, res) => {
    const requestedSource = req.params.source;
    const requestedSlug = req.params.slug;

    if (!(requestedSource in urlList)) {
        return res.status(400).json({
            message: `${requestedSource} is not available for scraping`
        });
    }

    try {
        const response = await fetchMangaPage(
            Object.values(urlList[requestedSource]).join("/") + "/" + requestedSlug
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/chapter/:source/:slug", async (req, res) => {
    const requestedSource = req.params.source;
    const requestedSlug = req.params.slug;

    if (!(requestedSource in urlList)) {
        return res.status(400).json({
            message: `${requestedSource} is not available for scraping`
        });
    }

    try {
        const response = await fetchChapterPage(
            urlList[requestedSource].base + "/" + requestedSlug
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
