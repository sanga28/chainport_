// deepMetrics/extractSource.js
const fs = require("fs");

module.exports = function extractSource(containerPath) {
  // In real system: docker save + layer extract
  // Here: assume source already available
  const files = fs.readdirSync(containerPath);

  return files
    .filter(f => f.endsWith(".js"))
    .map(f => ({
      filename: f,
      code: fs.readFileSync(`${containerPath}/${f}`, "utf8")
    }));
};
