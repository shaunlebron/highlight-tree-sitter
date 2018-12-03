// To create tree-sitter highlighted syntax,
// we generate an s-expression tree for transforming to HTML.

// An s-expression is a nested JS array:
// Example:  ["name", ...nodes]
// - "name": can be anything, represents the node type
// - ...nodes: other nodes (or strings)

// s-expression pretty-printer for better visualizing our API output below
const { printSexp } = require("./printSexp.js");

// Get partial s-expression (for debugging):
// (same as ast.rootNode.toString() but in data form)
// - only named node types are shown
// - (no text)
function partialSexp(ast) {
  function walk(node) {
    return node.isNamed ? [
      node.type,
      ...node.children.map(walk).filter(x => x)
    ] : null;
  }
  return walk(ast.rootNode);
}


// Get full s-expression:
// - _root = top level node to catch extra whitespace
// - _anon = unnamed node
// - (all text is shown as quoted forms)
function fullSexp(code, ast) {
  let lastTextI = 0;
  function flushText(i) {
    let text = code.slice(lastTextI, i);
    lastTextI = i;
    return text ? [text] : [];
  }
  function walk(node) {
    const preText = flushText(node.startIndex);
    const children = [].concat(...node.children.map(walk));
    const text = flushText(node.endIndex);
    const name = node.isNamed ? node.type : "_anon";
    return [...preText, [name, ...children, ...text]];
  }
  return ["_root", ...walk(ast.rootNode), ...flushText(code.length)];
}


// Get HTML:
// -  each node is wrapped in <span class="<name>"></span>
function printHtml(sexp) {
  function print(node) {
    if (typeof node === "string") return node;
    const [name, ...children] = node;
    return `<span class="${name}">${children.map(print).join("")}</span>`;
  }
  return `<pre>${print(sexp)}</pre>`;
}


module.exports = { partialSexp, fullSexp, printSexp, printHtml };
