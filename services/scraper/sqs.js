const { SQSClient, SendMessageBatchCommand } = require('@aws-sdk/client-sqs');
const { v5: uuidv5 } = require('uuid');
const logger = require('logger');

const { region, scraperQueueUrl } = process.env;

const sqsClient = new SQSClient({ region });

//  TODO memoization?
function getSlug (url) {
  return url.split('/').slice(-2, -1).toString().replace(/[\d]*[-]?/, '');
}

async function addQueues (data, request) {
  try {
    logger.debug(`In addQueues`);
    const entries = new Set();
    for await (const element of data) {
      const message = {
        'urlToScrape': element.get('urlToScrape'),
        'requestType': request,
        'provider': element.get('_type'),
      };
      const entry = {
        'Id': uuidv5(message['urlToScrape'], uuidv5.URL),
        'MessageBody': JSON.stringify(message),
        'MessageDeduplicationId': `${new Date().getHours()}-${getSlug(message['urlToScrape'])}`,
        'MessageGroupId': request,
      };
      entries.add(entry);
      if (entries.size === 10) {
        const commandParams = { 'Entries': Array.from(entries), 'QueueUrl': scraperQueueUrl }
        await sqsClient.send(new SendMessageBatchCommand(commandParams));
        entries.clear();
      }
    }
  } catch (error) {
    logger.error(`addQueues failed: `, error.message);
    throw error;
  }
}

module.exports = addQueues;
