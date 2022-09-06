const logger = require('logger');
const scraper = require('./scraper');
const dynamodb = require('./dynamodb');
const addQueues = require('./sqs');

const putType = {
  'MangaList': dynamodb.putSeriesCollection,
  'Manga': dynamodb.updateSeries,
  'ChapterList': dynamodb.putChapterCollection,
  'Chapter': dynamodb.updateChapter,
};

const queueType = {
  'MangaList': 'Manga',
  'ChapterList': 'Chapter',
};

exports.handler = async function (event) {
  for await (const { messageId, body } of event.Records) {
    try {
      logger.info(`SQS message: `, messageId, body);
      const { urlToScrape, requestType, provider } = JSON.parse(body);
      const result = await scraper(urlToScrape, requestType, provider);
      const { followup, status } = await putType[requestType](result);
      if (followup) await addQueues(followup, queueType[requestType]);
      await dynamodb.updateStatus(messageId, 'completed', status);
    } catch (error) {
      logger.error(error.message);
      await dynamodb.updateError(messageId, 'failed', error.message);
    }
  }
};
