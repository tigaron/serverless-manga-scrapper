const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const logger = require('logger');
const dynamodb = require('./dynamodb');

const app = express();

const stream = { write: (message) => logger.info(message.trim()) };
const httpLogger = morgan('short', { stream });

app.use(httpLogger);
app.use(express.json());

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found: "${req.originalUrl}"`);
  next(error);
}

function errorHandler(err, req, res, next) {
  logger.error(err.message);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    'status': statusCode,
    'statusText': err.message,
  });
}

app.get('/updates', async function (req, res, next) {
  try {
    const today = new Date();
    let result = null;
    if (today.getUTCHours() > 11) {
      const scToday = today.toUTCString().split(' '). slice(0, 4).join(' ');
      result = await dynamodb.scanTable(scToday);
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const scYesterday = yesterday.toUTCString().split(' '). slice(0, 4).join(' ');
      result = await dynamodb.scanTable(scYesterday);
    }
    if (!result.size) {
      res.status(404);
      throw new Error(`No updates found`);
    }
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': Object.fromEntries(result),
    });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

exports.handler = serverless(app);
