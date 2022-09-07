const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const logger = require('logger');

const { region, scraperQueueUrl } = process.env;

const sqsClient = new SQSClient({ region });

function getSlug (url) {
  return url.split('/').slice(-2, -1).toString().replace(/[\d]*[-]?/, '');
}

async function addQueue (postRequest) {
  try {
    logger.debug(`In addQueue`);
    const commandParams = {
      'MessageBody': JSON.stringify(postRequest),
      'MessageDeduplicationId': `${new Date().getHours()}-${getSlug(postRequest['urlToScrape'])}`,
      'MessageGroupId': postRequest['requestType'],
      'QueueUrl': scraperQueueUrl,
    };
    const { MessageId } = await sqsClient.send(new SendMessageCommand(commandParams));
    return MessageId;
  } catch (error) {
    logger.error(`addQueue failed: `, error.message);
    throw error;
  }
}

module.exports = addQueue;
