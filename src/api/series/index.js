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

app.get('/', (req, res) => {
  res.json({
    status: 200,
    statusText: 'OK',
    data: Array.from(providerMap.keys()),
  });
});

exports.handler = serverless(app);
