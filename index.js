// To create tree-sitter highlighted syntax,
// we generate an s-expression tree for transforming to HTML.

// An s-expression is a nested JS array:
// Example:  ["name", ...nodes]
// - "name": can be anything, represents the node type
// - ...nodes: other nodes (or strings)

// s-expression pretty-printer for better visualizing our API output below
const { printSexp } = require("./printSexp.js");

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

function getNodeText(node) {
  if (typeof node === "string") return node;
  const [name, ...children] = node;
  return children.map(getNodeText).join("");
}

function renameSexp(sexp, rename) {
  function walk(node, path) {
    if (typeof node === "string") return node;
    const [name, ...children] = node;
    const newName = rename(node, path);
    let i=0;
    const newChildren = children.map(child =>
      typeof child === "string"
        ? child
        : walk(child, [...path, {i:i++, name:child[0]}]));
    return [newName, ...newChildren];
  }
  return walk(sexp, []);
}

function flattenSexp(sexp, shouldFlatten) {
  function walk(node) {
    if (typeof node === "string") return node;
    const [name, ...children] = node;
    const newChildren = [].concat(...children.map(child => {
      const flat = shouldFlatten(child);
      const newChild = walk(child);
      return flat ? newChild.slice(1) : [newChild];
    }));
    return [name, ...newChildren];
  }
  return walk(sexp);
}

function highlightSexp(sexp, getNodeClasses) {
  sexp = renameSexp(sexp, (node,path) => [node[0], ...getNodeClasses(node, path)].join("."));
  sexp = flattenSexp(sexp, node => node[0].includes("."));
  return sexp;
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
