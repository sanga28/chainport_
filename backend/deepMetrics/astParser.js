// deepMetrics/astParser.js
const parser = require("@babel/parser");

module.exports = function parseToAST(code) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });
};
