const cheerio = require('cheerio');
const logger = require('logger');
const crawler = require('crawler');

function loadHTML (html) {
  logger.debug(`In loadHTML`);
  return cheerio.load(html);
}

function getSlug (url) {
  return url.split('/').slice(-2, -1).toString().replace(/[\d]*[-]?/, '');
}

function parseMangaList ($, provider) {
  logger.debug(`In parseMangaList`);
  const MangaList = new Set();
  try {
    $('a.series', 'div.soralist').each((index, element) => {
      MangaList.add(new Map([
        ['_type', provider],
        ['_id', getSlug($(element).attr('href'))],
        ['MangaTitle', $(element).text().trim()],
        ['MangaUrl', $(element).attr('href')],
        ['ScrapeDate', new Date().toUTCString()],
      ]));
    });
  } catch (error) {
    logger.error(`parseMangaList failed: `, error.message);
    MangaList.clear();
  }
  logger.debug(`parseMangaList result:`, MangaList);
  return MangaList;
}

function parseSeriesChapter ($, provider) {
  logger.debug(`In parseSeriesChapter`);
  const Manga = new Map();
  const ChapterList = new Set();
  try {
    const MangaSynopsis = new Set();
    $('div.entry-content').contents().each((index, element) => {
      $(element).text().split(/\n/).forEach(p => {
        if (p.trim()) MangaSynopsis.add(p.trim());
      });
    });
    Manga.set('_type', provider);
    Manga.set('_id', getSlug($('meta[property="og:url"]').attr('content')));
    Manga.set('MangaTitle', $('h1.entry-title').text().trim());
    Manga.set('MangaSynopsis', Array.from(MangaSynopsis));
    Manga.set('MangaCover', $('img', 'div.thumb').attr('src'));
    Manga.set('MangaShortUrl', $('link[rel="shortlink"]').attr('href'));
    Manga.set('ScrapeDate', new Date().toUTCString());

    $('a', 'div.eplister').each((index, element) => {
      const ChapterDate = $('span.chapterdate', element).text().trim();
      if (Date.now() - new Date(ChapterDate) > (1000 * 60 * 60 * 24 * 2)) {
        return;
      } else {
        const liNum = $(element).parents('li').data('num');
        const Chapter = new Map([
          ['_type', `${provider}_${Manga.get('_id')}`],
          ['_id', getSlug($(element).attr('href'))],
          ['ChapterOrder', /\d/.test(liNum) ? parseInt(liNum.toString().match(/(\d+)/)[1], 10) : 0],
          ['ChapterNumber', $('span.chapternum', element).text().trim().replace(/\n/, ' ')],
          ['ChapterUrl', $(element).attr('href')],
          ['ChapterDate', ChapterDate],
          ['ScrapeDate', new Date().toUTCString()],
        ]);
        ChapterList.add(Chapter);
      }
    });
  } catch (error) {
    logger.error(`parseSeriesChapter failed: `, error.message);
    Manga.clear();
    ChapterList.clear();
  }
  logger.debug(`parseSeriesChapter result:`, Manga, ChapterList);
  return { Manga, ChapterList };
}

function parseChapterList ($, provider) {
  logger.debug(`In parseChapterList`);
  const ChapterList = new Set();
  try {
    $('a', 'div.eplister').each((index, element) => {
      const ChapterDate = $('span.chapterdate', element).text().trim();
      if (Date.now() - new Date(ChapterDate) > (1000 * 60 * 60 * 24 * 2)) {
        return;
      } else {
        const liNum = $(element).parents('li').data('num');
        const Chapter = new Map([
          ['_type', `${provider}_${getSlug($('meta[property="og:url"]').attr('content'))}`],
          ['_id', getSlug($(element).attr('href'))],
          ['ChapterOrder', /\d/.test(liNum) ? parseInt(liNum.toString().match(/(\d+)/)[1], 10) : 0],
          ['ChapterNumber', $('span.chapternum', element).text().trim().replace(/\n/, ' ')],
          ['ChapterUrl', $(element).attr('href')],
          ['ChapterDate', ChapterDate],
          ['ScrapeDate', new Date().toUTCString()],
        ]);
        ChapterList.add(Chapter);
      }
    });
  } catch (error) {
    logger.error(`parseChapterList failed: `, error.message);
    ChapterList.clear();
  }
  logger.debug(`parseChapterList result:`, ChapterList);
  return { ChapterList };
}

function parseChapter ($, manga) {
  logger.debug(`In parseChapter`);
  const Chapter = new Map();
  try {
    const tsReaderScript = $('script:contains("ts_reader.run")').contents().text();
    const scriptContent = tsReaderScript.match(/ts_reader.run\((.*?)\)/)[1];
    const { prevUrl, nextUrl, sources } = JSON.parse(scriptContent);
    const { images } = sources[0];
    const ChapterContent = new Set();
    for (const img of images) { ChapterContent.add(img) }
    Chapter.set('_type', manga);
    Chapter.set('_id', getSlug($('meta[property="og:url"]').attr('content')));
    Chapter.set('ChapterTitle', $('h1.entry-title').text().trim());
    Chapter.set('ChapterShortUrl', $('link[rel="shortlink"]').attr('href'));
    Chapter.set('ChapterPrevSlug', getSlug(prevUrl));
    Chapter.set('ChapterNextSlug', getSlug(nextUrl));
    Chapter.set('ChapterContent', Array.from(ChapterContent));
    Chapter.set('ScrapeDate', new Date().toUTCString());
  } catch (error) {
    logger.error(`parseChapter failed: `, error.message);
    Chapter.clear();
  }
  logger.debug(`parseChapter result:`, Chapter);
  return Chapter;
}

function getScrapedData ($, provider, type) {
  const result = {
    'MangaList': parseMangaList,
    'SeriesChapter': parseSeriesChapter,
    'ChapterList': parseChapterList,
    'Chapter': parseChapter,
  };
  return result[type]($, provider);
}

async function scraper (url, type, provider) {
  try {
    logger.debug(`In scraper: ${type} - ${url}`);
    const htmlString = await crawler(url);
    const $ = loadHTML(htmlString);
    const result = getScrapedData($, provider, type);
    return result;
  } catch (error) {
    logger.error(`Scraper fail: `, error.message);
    throw error;
  }
}

module.exports = scraper;
