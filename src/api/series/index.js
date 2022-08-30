const express = require('express');
const serverless = require('serverless-http');
const log4js = require('log4js');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const { logLevel } = process.env;

log4js.configure({
  appenders: { logger: { type: 'console' } },
  categories: { default: { appenders: ['logger'], level: logLevel } },
});

const logger = log4js.getLogger('logger');

const stream = {
  write: (message) => logger.info(message.trim()),
};

const httpLogger = morgan('short', { stream });

app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());

const providerMap = new Map([
  ['alpha', 'https://alpha-scans.org/manga/list-mode/'],
  ['asura', 'https://www.asurascans.com/manga/list-mode/'],
  ['flame', 'https://flamescans.org/series/list-mode/'],
  ['luminous', 'https://luminousscans.com/series/list-mode/'],
  ['manhwax', 'https://manhwax.com/manga/list-mode/'],
  ['omega', 'https://omegascans.org/manga/list-mode/'],
  ['realm', 'https://realmscans.com/series/list-mode/'],
]);

app.get('/series', async (req, res) => {
  try {
    // TODO get manga list from ddb
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': req.query,
    });
  } catch (error) {
    res.status(503).json({
      'status': 503,
      'statusText': error.name,
      'message': error.messsage,
      'stack': logLevel === 'info' ? '' : error.stack,
    });
  }
});

app.post('/series', async (req, res) => {
  try {
    // TODO send message to sqs queue
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'data': req.query,
    });
  } catch (error) {
    logger.info(`${error.name}: ${error.message}`);
    res.status(503).json({
      'status': 503,
      'statusText': error.name,
      'message': error.messsage,
      'stack': logLevel === 'info' ? '' : error.stack,
    });
  }
});

app.get('/series/:seriesId', async (req, res) => {
  try {
    // TODO get manga from ddb
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': { query: req.query, params: req.params },
    });
  } catch (error) {
    res.status(503).json({
      'status': 503,
      'statusText': error.name,
      'message': error.messsage,
      'stack': logLevel === 'info' ? '' : error.stack,
    });
  }
});

app.post('/series/:seriesId', async (req, res) => {
  try {
    // TODO get manga from ddb
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'data': { query: req.query, params: req.params },
    });
  } catch (error) {
    res.status(503).json({
      'status': 503,
      'statusText': error.name,
      'message': error.messsage,
      'stack': logLevel === 'info' ? '' : error.stack,
    });
  }
});

exports.handler = serverless(app);
