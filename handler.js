const serverless = require("serverless-http");
const app = require("./src/index.js");

module.exports.handler = serverless(app);
