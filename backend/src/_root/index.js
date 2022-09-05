const log4js = require('log4js');

const { logLevel } = process.env;

log4js.configure({
  appenders: { logger: { type: 'console' } },
  categories: { default: { appenders: ['logger'], level: logLevel } },
});

const logger = log4js.getLogger('logger');

exports.handler = async function (event, context) {
  logger.debug(`Event: ${JSON.stringify(event, null, 2)}`);
  logger.debug(`Context: ${JSON.stringify(context, null, 2)}`);
  return {
    'statusCode': 200,
    'body': JSON.stringify({
      'status': 200,
      'statusText': 'OK',
      'data': {
        'providers': [
          'alpha',
          'asura',
          'flame',
          'luminous',
          'omega',
          'realm',
        ]
      },
    }),
  };
};
