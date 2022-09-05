const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const chromium = require('@sparticuz/chrome-aws-lambda');
const cheerio = require('cheerio');
const log4js = require('log4js');

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const { region, logLevel, mangaTable, scraperQueueUrl } = process.env;

log4js.configure({
  appenders: { logger: { type: 'console' } },
  categories: { default: { appenders: ['logger'], level: logLevel } },
});

const logger = log4js.getLogger('logger');

async function crawler (urlString) {
  let browser = null;
  try {
    logger.debug(`In crawler`);
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    logger.debug(`Launched browser instance`);
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      if (interceptedRequest.resourceType() !== 'document') interceptedRequest.abort();
      else interceptedRequest.continue();
    });
    logger.debug(`Configured browser page`);
    const response = await page.goto(urlString, { waitUntil: 'domcontentloaded' });
    if (!response.ok()) throw new Error(`Failed to crawl '${urlString}'`, { cause: response.status() });
    const result = await page.content();
    return result;
  } catch (error) {
    logger.error(error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

function loadHTML (htmlString) {
  logger.debug(`In loadHTML`);
  return cheerio.load(htmlString);
}

function parseMangaList ($, mangaProvider) {
  logger.debug(`In parseMangaList`);
  const MangaList = new Set();
  $('a.series', 'div.soralist').each((index, element) => {
    const MangaTitle = $(element).text().trim();
    const MangaUrl = $(element).attr('href');
    const MangaSlug = MangaUrl.split('/').slice(-2).shift().replace(/[\d]*[-]?/, '');
    const timestamp = new Date().toUTCString();
    const Manga = new Map([
      ['_type', `series_${mangaProvider}`],
      ['_id', MangaSlug],
      ['MangaTitle', MangaTitle],
      ['MangaUrl', MangaUrl],
      ['ScrapeDate', timestamp],
    ]);
    MangaList.add(Manga);
  });
  return MangaList;
}

function parseManga ($, mangaType) {
  logger.debug(`In parseManga`);
  const MangaTitle = $('h1.entry-title').text().trim();
  let MangaSynopsis = $('p', 'div.entry-content').text();
  if (!MangaSynopsis) MangaSynopsis = $('div.entry-content').contents().text();
  const MangaCover = $('img', 'div.thumb').attr('src');
  const MangaShortUrl = $('link[rel="shortlink"]').attr('href');
  const MangaCanonicalUrl = $('link[rel="canonical"]').attr('href');
  const MangaSlug = MangaCanonicalUrl.split('/').slice(-2).shift().replace(/[\d]*[-]?/, '');
  const timestamp = new Date().toUTCString();
  const Manga = new Map([
    ['_type', mangaType],
    ['_id', MangaSlug],
    ['MangaTitle', MangaTitle],
    ['MangaSynopsis', MangaSynopsis],
    ['MangaCover', MangaCover],
    ['MangaShortUrl', MangaShortUrl],
    ['MangaCanonicalUrl', MangaCanonicalUrl],
    ['ScrapeDate', timestamp],
  ]);
  return Manga;
}

function parseChapterList ($, mangaProvider) {
  logger.debug(`In parseChapterList`);
  const MangaSlug = $('link[rel="canonical"]').attr('href').split('/').slice(-2).shift().replace(/[\d]*[-]?/, '');
  const ChapterList = new Set();
  $('a', 'div.eplister').each((index, element) => {
    let ChapterNumber = $('span.chapternum', element).text().trim();
    if (ChapterNumber.includes('\n')) ChapterNumber = ChapterNumber.split('\n').slice(-2).join(' ');
    const ChapterDate = $('span.chapterdate', element).text().trim();
    const liNum = $(element).parents('li').data('num');
    const ChapterOrder = Number.isInteger(liNum) ? liNum : /\d/.test(liNum) ? parseInt(liNum.toString().match(/(\d+)./)[1], 10) : 0;
    const ChapterUrl = $(element).attr('href');
    const ChapterSlug = ChapterUrl.split('/').slice(-2).shift().replace(/[\d]*[-]?/, '');
    const timestamp = new Date().toUTCString();
    const Chapter = new Map([
      ['_type', `chapter_${mangaProvider}_${MangaSlug}`],
      ['_id', ChapterSlug],
      ['ChapterOrder', ChapterOrder],
      ['ChapterNumber', ChapterNumber],
      ['ChapterUrl', ChapterUrl],
      ['ChapterDate', ChapterDate],
      ['ScrapeDate', timestamp],
    ]);
    ChapterList.add(Chapter);
  });
  return ChapterList;
}

function parseChapter ($, chapterType) {
  logger.debug(`In parseChapter`);
  const ChapterTitle = $('h1.entry-title').text().trim();
  const ChapterShortUrl = $('link[rel="shortlink"]').attr('href');
  let ChapterCanonicalUrl = $('link[rel="canonical"]').attr('href');
  if (!ChapterCanonicalUrl) ChapterCanonicalUrl = $('meta[property="og:url"]').attr('content');
  const ChapterSlug = ChapterCanonicalUrl.split('/').slice(-2).shift().replace(/[\d]*[-]?/, '');
  const navScript = $('script:contains("ts_reader.run")').contents().text();
  const ChapterPrevSlug = navScript.match(/"prevUrl":"(.*?)"/)[1].split('/').slice(-2).shift().replace(/[\d]*[-]?/, '').replace(/\\/, '');
  const ChapterNextSlug = navScript.match(/"nextUrl":"(.*?)"/)[1].split('/').slice(-2).shift().replace(/[\d]*[-]?/, '').replace(/\\/, '');
  const timestamp = new Date().toUTCString();
  const ChapterContent = new Set();
  const scriptImages = navScript.match(/ts_reader.run\((.*?)\)/)[1];
  const objectImages = JSON.parse(scriptImages);
  const { images } = objectImages.sources[0];
  for (const img of images) {
    ChapterContent.add(img);
  }
  const Chapter = new Map([
    ['_type', chapterType],
    ['_id', ChapterSlug],
    ['ChapterTitle', ChapterTitle],
    ['ChapterShortUrl', ChapterShortUrl],
    ['ChapterCanonicalUrl', ChapterCanonicalUrl],
    ['ChapterPrevSlug', ChapterPrevSlug],
    ['ChapterNextSlug', ChapterNextSlug],
    ['ChapterContent', Array.from(ChapterContent)],
    ['ScrapeDate', timestamp],
  ]);
  return Chapter;
}

function getScrapedData ($, mangaProvider, requestType) {
  const result = {
    'MangaList': parseMangaList,
    'Manga': parseManga,
    'ChapterList': parseChapterList,
    'Chapter': parseChapter,
  };
  return result[requestType]($, mangaProvider);
}

async function scraper (urlString, requestType, mangaProvider) {
  try {
    logger.debug(`In scraper: ${requestType} - ${urlString}`);
    const htmlString = await crawler(urlString);
    const $ = loadHTML(htmlString);
    const result = getScrapedData($, mangaProvider, requestType);
    logger.debug(`Scraper success: `, result);
    return result;
  } catch (error) {
    logger.error(`Scraper fail: `, error);
    throw error;
  }
}

async function putItem (item) {
  try {
    logger.debug(`In putItem`);
    const commandParams = {
      'TableName': mangaTable,
      'Item': item,
      'ExpressionAttributeNames': { '#I': '_id' },
      'ConditionExpression': 'attribute_not_exists(#I)',
    };
    logger.debug(`putItem command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new PutCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`putItem response: `, response);
    return false;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') return true;
    logger.error(error);
    return error;
  }
}

async function updateStatus (type, id, status, data) {
  try {
    logger.debug(`In updateStatus`);
    const commandParams = {
      'TableName': mangaTable,
      'Key': { '_type': type, '_id': id },
      'ExpressionAttributeNames': { '#S': 'Status', '#D': 'Data' },
      'ExpressionAttributeValues': { ':s': status, ':d': data },
      'UpdateExpression': 'SET #S = :s, #D = :d',
    };
    logger.debug(`updateStatus command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new UpdateCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`updateStatus response: `, response);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function updateError (type, id, status, error) {
  try {
    logger.debug(`In updateStatus`);
    const commandParams = {
      'TableName': mangaTable,
      'Key': { '_type': type, '_id': id },
      'ExpressionAttributeNames': { '#S': 'Status', '#E': 'Error' },
      'ExpressionAttributeValues': { ':s': status, ':e': error },
      'UpdateExpression': 'SET #S = :s, #E = :e',
    };
    logger.debug(`updateStatus command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new UpdateCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`updateStatus response: `, response);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function uploadListData (data) {
  try {
    logger.debug(`In uploadListData`);
    const accepted = new Set();
    const rejected = new Set();
    const followup = new Set();
    for await (const element of data) {
      const data = await putItem(element);
      if (data) {
        rejected.add(`"${element.get('_id')}" - Already exist.`);
      } else if (data instanceof Error) {
        rejected.add(`"${element.get('_id')}" - ${data.name}: ${data.message}`);
      } else {
        accepted.add(element.get('_id'));
        followup.add(new Map ([
          ['_type', element.get('_type')],
          ['urlToScrape', element.has('MangaUrl') ? element.get('MangaUrl') : element.get('ChapterUrl') ],
        ]));
      }
    }
    const result = {
        'Accepted': accepted.size ? accepted : undefined,
        'Rejected': rejected.size ? rejected : undefined,
    };
    logger.debug(`Follow-Up: `, followup);
    logger.debug(`Result: `, result);
    return {
      'followup': followup.size ? followup : undefined,
      'result': result,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function uploadMangaData (data) {
  try {
    logger.debug(`In uploadMangaData`);
    const commandParams = {
      'TableName': mangaTable,
      'Key': { '_type': data.get('_type'), '_id': data.get('_id') },
      'ExpressionAttributeNames': {
        '#MT': 'MangaTitle',
        '#MS': 'MangaSynopsis',
        '#MC': 'MangaCover',
        '#SU': 'MangaShortUrl',
        '#CU': 'MangaCanonicalUrl',
        '#SD': 'ScrapeDate',
      },
      'ExpressionAttributeValues': {
        ':mt': data.get('MangaTitle') ? data.get('MangaTitle') : '',
        ':ms': data.get('MangaSynopsis') ? data.get('MangaSynopsis') : '',
        ':mc': data.get('MangaCover') ? data.get('MangaCover') : '',
        ':su': data.get('MangaShortUrl') ? data.get('MangaShortUrl') : '',
        ':cu': data.get('MangaCanonicalUrl') ? data.get('MangaCanonicalUrl') : '',
        ':sd': data.get('ScrapeDate'),
      },
      'UpdateExpression': 'SET #MT = :mt, #MS = :ms, #MC = :mc, #SU = :su, #CU = :cu, #SD = :sd',
    };
    logger.debug(`uploadMangaData command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new UpdateCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`uploadMangaData response: `, response);
    const result = response.$metadata.httpStatusCode === 200 ? `Accepted: ${data.get('_id')}` : `Rejected: ${data.get('_id')}`;
    logger.debug(`Result: `, result);
    return { 'result': result };
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function uploadChapterData (data) {
  try {
    logger.debug(`In uploadChapterData`);
    const commandParams = {
      'TableName': mangaTable,
      'Key': { '_type': data.get('_type'), '_id': data.get('_id') },
      'ExpressionAttributeNames': {
        '#CT': 'ChapterTitle',
        '#CS': 'ChapterShortUrl',
        '#CU': 'ChapterCanonicalUrl',
        '#PS': 'ChapterPrevSlug',
        '#NS': 'ChapterNextSlug',
        '#CC': 'ChapterContent',
        '#SD': 'ScrapeDate',
      },
      'ExpressionAttributeValues': {
        ':ct': data.get('ChapterTitle') ? data.get('ChapterTitle') : '',
        ':cs': data.get('ChapterShortUrl') ? data.get('ChapterShortUrl') : '',
        ':cu': data.get('ChapterCanonicalUrl') ? data.get('ChapterCanonicalUrl') : '',
        ':ps': data.get('ChapterPrevSlug') ? data.get('ChapterPrevSlug') : '',
        ':ns': data.get('ChapterNextSlug') ? data.get('ChapterNextSlug') : '',
        ':cc': data.get('ChapterContent') ? data.get('ChapterContent') : '',
        ':sd': data.get('ScrapeDate'),
      },
      'UpdateExpression': 'SET #CT = :ct, #CS = :cs, #CU = :cu, #PS = :ps, #NS = :ns, #CC = :cc, #SD = :sd',
    };
    logger.debug(`uploadChapterData command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new UpdateCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`uploadChapterData response: `, response);
    const result = response.$metadata.httpStatusCode === 200 ? `Accepted: ${data.get('_id')}` : `Rejected: ${data.get('_id')}`;
    logger.debug(`Result: `, result);
    return { 'result': result };
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function addQueue (data) {
  try {
    logger.debug(`In addQueue`);
    const sqsClient = new SQSClient({ region: region });
    const sqsCommand = new SendMessageCommand(data);
    const sqsResponse = await sqsClient.send(sqsCommand);
    logger.debug(`SQS response: `, sqsResponse);
    return sqsResponse;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function followUpRequest (followUpData, originRequestType) {
  try {
    logger.debug(`In followUpRequest`);
    const followUpRequestType = {
      'MangaList': 'Manga',
      'ChapterList': 'Chapter',
    };
    for await (const element of followUpData) {
      const followUpRequestData = {
        'urlToScrape': element.get('urlToScrape'),
        'requestType': followUpRequestType[originRequestType],
        'provider': element.get('_type'),
      };
      const sqsCommandParams = {
        'MessageBody': JSON.stringify(followUpRequestData),
        'MessageDeduplicationId': `${new Date().getMinutes()}-${followUpRequestData['urlToScrape'].split('/').slice(-2).shift().replace(/[\d]*[-]?/, '')}`,
        'MessageGroupId': followUpRequestData['requestType'],
        'QueueUrl': scraperQueueUrl,
      };
      await addQueue(sqsCommandParams);
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

exports.handler = async function (event) {
  for await (const message of event.Records) {
    try {
      logger.debug(`SQS message: `, message);
      const { urlToScrape, requestType, provider } = JSON.parse(message.body);
      const scraperResponse = await scraper(urlToScrape, requestType, provider);
      const uploadType = {
        'MangaList': uploadListData,
        'Manga': uploadMangaData,
        'ChapterList': uploadListData,
        'Chapter': uploadChapterData,
      };
      const { followup, result } = await uploadType[requestType](scraperResponse);
      if (followup) await followUpRequest(followup, requestType);
      // TODO update prevElement, add next chapter attribute
      await updateStatus('request-status', message.messageId, 'completed', result);
    } catch (error) {
      logger.error(error);
      await updateError('request-status', message.messageId, 'failed', error.message);
    }
  }
  return {};
};

/* async function queryChapters (type) {
  logger.debug(`In queryChapters`);
  const commandParams = {
    'TableName': mangaTable,
    'ExpressionAttributeNames': { '#T': '_type', '#CN': 'ChapterNextSlug' },
    'ExpressionAttributeValues': { ':t': type },
    'KeyConditionExpression': '#T = :t',
    'ConditionExpression': 'attribute_type(#CN, NULL) OR attribute_not_exists(#CN)'
  };
  const client = new DynamoDBClient({ region: region });
  const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
  const command = new QueryCommand(commandParams);
  const response = await ddbDocClient.send(command);
  logger.debug(`queryChapters response: `, response);
  if (response.Items.length !== 0) return response.Items;
  else return false;
}
async function refreshNextChapter (params) {
  const result = await queryChapters();
  // use url result to scrape
} */