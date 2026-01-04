// deepMetrics/metadataComparator.js
module.exports = function metadataCompare(a, b) {
  return a.baseImage === b.baseImage ? 100 : 0;
};
