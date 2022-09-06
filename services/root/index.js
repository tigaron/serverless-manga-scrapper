exports.handler = async function () {
  const providerData = { 'providers': [ 'alpha', 'asura', 'flame', 'luminous', 'omega', 'realm' ] }
  return {
    'statusCode': 200,
    'body': JSON.stringify({ 'status': 200, 'message': 'OK', 'data': providerData }),
  };
};
