// deepMetrics/securityComparator.js
module.exports = function securityCompare(a, b) {
  let score = 0;
  if (a.privileged === b.privileged) score += 40;
  if (a.openPorts.join() === b.openPorts.join()) score += 60;
  return score;
};
