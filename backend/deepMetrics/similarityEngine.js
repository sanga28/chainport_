// deepMetrics/similarityEngine.js
module.exports = function structuralSimilarity(hashesA, hashesB) {
  const setA = new Set(hashesA);
  const setB = new Set(hashesB);

  const intersection = [...setA].filter(h => setB.has(h));

  const score = (intersection.length / setA.size) * 100;

  return {
    similarity: Math.round(score),
    sharedBlocks: intersection.length
  };
};
