const logger = require('logger');
const scraper = require('./scraper');
const dynamodb = require('./dynamodb');

const putType = {
  'MangaList': dynamodb.putSeriesCollection,
  'Manga': dynamodb.updateSeries,
  'ChapterList': dynamodb.putChapterCollection,
  'Chapter': dynamodb.updateChapter,
};

/* const providerUpdates = new Map([
  ['alpha', 'https://alpha-scans.org/manga/?order=update'],
  ['asura', 'https://www.asurascans.com/manga/?order=update'],
  ['flame', 'https://flamescans.org/series/?order=update'],
  ['luminous', 'https://luminousscans.com/series/?order=update'],
  ['omega', 'https://omegascans.org/manga/?order=update'],
  ['realm', 'https://realmscans.com/series/?order=update'],
]);

const providerMap = new Map([
  ['alpha', 'https://alpha-scans.org/'],
  ['asura', 'https://www.asurascans.com/'],
  ['flame', 'https://flamescans.org/'],
  ['luminous', 'https://luminousscans.com/'],
  ['omega', 'https://omegascans.org/'],
  ['realm', 'https://realmscans.com/'],
]); */

const providerUpdates = new Map([
  ['asura', 'https://www.asurascans.com/manga/?order=update'],
]);

const providerMap = new Map([
  ['asura', 'https://www.asurascans.com/'],
]);

exports.handler = async () => {
  try {
    logger.info(`Cron started at ${new Date().toUTCString()}`);
    for await (const [key, value] of providerUpdates) {
      const series = await scraper(value, 'MangaList', key);
      const { followup: seriesFU } = await putType['MangaList'](series);
      let chapterFU = null;
      for await (const element of series) {
        let result = null;
        if (seriesFU.has(element.get('MangaUrl'))) {
          result = await scraper(element.get('MangaUrl'), 'SeriesChapter', key);
        } else {
          result = await scraper(element.get('MangaUrl'), 'ChapterList', key);
        }
        const { Manga, ChapterList } = result;
        if (Manga) await putType['Manga'](Manga);
        if (ChapterList) {
          chapterFU = await putType['ChapterList'](ChapterList);
        }
      }
      if (chapterFU) {
        const chapter = await scraper(chapterFU.get('urlToScrape'), 'Chapter', chapterFU.get('_type'));
        const prevChapter = await scraper(providerMap.get(key) + chapterFU.get('prevChapter'), 'Chapter', chapterFU.get('_type'));
        await putType['Chapter'](chapter);
        await putType['Chapter'](prevChapter);
      }
    }
  } catch (error) {
    logger.error(`Cron failed: `, error.message);
  }
};
