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

app.get('/status/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const status = await dynamodb.getStatus(id);
    logger.debug(`GET status by id result: `, status);
    if (!status) {
      res.status(404);
      throw new Error(`Not found: "${req.originalUrl}`);
    }
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': status,
    });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

exports.handler = serverless(app);
