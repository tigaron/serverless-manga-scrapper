const logger = require('logger');
const scraper = require('./scraper');
const dynamodb = require('./dynamodb');

const putType = {
  'MangaList': dynamodb.putSeriesCollection,
  'Manga': dynamodb.updateSeries,
  'ChapterList': dynamodb.putChapterCollection,
  'Chapter': dynamodb.updateChapter,
};

const providerUpdates = new Map([
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
]);

exports.handler = async () => {
  try {
    logger.info(`Cron started at ${new Date().toUTCString()}`);
    for await (const [key, value] of providerUpdates) {
      const series = await scraper(value, 'MangaList', key);
      const { followup: seriesFU } = await putType['MangaList'](series);
      for await (const element of series) {
        let result = null;
        if (seriesFU && seriesFU.has(element.get('MangaUrl'))) {
          result = await scraper(element.get('MangaUrl'), 'SeriesChapter', key);
        } else {
          result = await scraper(element.get('MangaUrl'), 'ChapterList', key);
        }
        const { Manga, ChapterList } = result;
        if (Manga) await putType['Manga'](Manga);
        if (ChapterList) {
          const { followup } = await putType['ChapterList'](ChapterList);
          if (followup) {
            const array = Array.from(followup);
            for await (const item of array) {
              const chapter = await scraper(item.get('urlToScrape'), 'Chapter', item.get('_type'));
              const prevChapterSlug = await putType['Chapter'](chapter);
              if (array.indexOf(item) === array.length - 1 && prevChapterSlug) {
                const prevChapter = await scraper(providerMap.get(key) + prevChapterSlug, 'Chapter', item.get('_type'));
                await putType['Chapter'](prevChapter);
              }
            }
          }
        }
      }
    }
    logger.info(`Cron finished at ${new Date().toUTCString()}`);
  } catch (error) {
    logger.error(`Cron failed: `, error.message);
    logger.error(`Cron failed: `, error.stack);
  }
};
