const got = require('got');
const log4js = require('log4js');

const { logLevel } = process.env;

log4js.configure({
  appenders: { logger: { type: 'console' } },
  categories: { default: { appenders: ['logger'], level: logLevel } },
});

const logger = log4js.getLogger('logger');

exports.handler = async (event, context) => {
  const url = '';
  const data = await got.post(url);
  const time = new Date();
  logger.info(`Your cron function "${context.functionName}" ran at ${time}`);
};
