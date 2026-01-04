// deepMetrics/normalizeAst.js
function normalize(node) {
  if (!node || typeof node !== "object") return;

  // Normalize identifiers
  if (node.type === "Identifier") {
    node.name = "VAR";
  }

  // Remove locations & comments
  delete node.loc;
  delete node.comments;

  for (let key in node) {
    normalize(node[key]);
  }
}

module.exports = function normalizeAst(ast) {
  const clone = JSON.parse(JSON.stringify(ast));
  normalize(clone);
  return clone;
};
