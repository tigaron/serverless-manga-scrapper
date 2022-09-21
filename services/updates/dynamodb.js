const { parallelScan } = require('@shelf/dynamodb-parallel-scan');
const logger = require('logger');

const { chapterTable } = process.env;

async function scanTable (date) {
  try {
    logger.debug(`In scanTable`);
    const commandParams = {
      'TableName': chapterTable,
      'ExpressionAttributeNames': { '#SD': 'ScrapeDate' },
      'ExpressionAttributeValues': { ':d': date },
      'FilterExpression': 'begins_with (#SD, :d)',
    };
    const data = await parallelScan(commandParams, {concurrency: 50});
    const result = new Map();
    if (data.length) {
      result.set('count', data.length);
      result.set('result', data);
    }
    return result;
  } catch (error) {
    logger.error(`scanTable failed: `, error.message);
    throw error;
  }
}

module.exports = {
  scanTable,
};
