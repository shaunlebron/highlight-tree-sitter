// Create s-expressions from Tree-Sitter tree.

// An s-expression is a nested JS array:
// Example:  ["name", ...nodes]
// - "name": can be anything, represents the node type
// - ...nodes: other nodes (or strings)

// Get partial s-expression (for debugging):
// (same as tree.rootNode.toString() but in data form)
// - only named node types are shown
// - (no text)
function partialSexp(tree) {
  function walk(node) {
    return node.isNamed ? [
      node.type,
      ...node.children.map(walk).filter(x => x)
    ] : null;
  }
  return walk(tree.rootNode);
}

// Get full s-expression:
// - _root = top level node to catch extra whitespace
// - _anon = unnamed node
// - (all text is shown as quoted forms)
function fullSexp(text, tree) {
  let lastTextI = 0;
  function flushText(i) {
    let slice = text.slice(lastTextI, i);
    lastTextI = i;
    return slice ? [slice] : [];
  }
  function walk(node) {
    const preText = flushText(node.startIndex);
    const children = [].concat(...node.children.map(walk));
    const text = flushText(node.endIndex);
    const name = node.isNamed ? node.type : "_anon";
    return [...preText, [name, ...children, ...text]];
  }
  return ["_root", ...walk(tree.rootNode), ...flushText(text.length)];
}

module.exports = { partialSexp, fullSexp };
