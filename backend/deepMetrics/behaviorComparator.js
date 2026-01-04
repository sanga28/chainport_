// deepMetrics/behaviorComparator.js
module.exports = function behaviorCompare(a, b) {
  const overlap =
    a.networkCalls.filter(x => b.networkCalls.includes(x)).length;

  return Math.min(100, Math.round((overlap / a.networkCalls.length) * 100));
};
