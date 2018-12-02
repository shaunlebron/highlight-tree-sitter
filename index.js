const prettier = require('prettier');

function partialSexp(ast) {
  function walk(node) {
    return node.isNamed ? [
      node.type,
      ...node.children.map(walk).filter(x => x)
    ] : null;
  }
  return walk(ast.rootNode);
}

function fullSexp(code, ast) {
  let a = 0;
  function getText(b) {
    let text = code.slice(a, b);
    a = b;
    return text ? [text] : [];
  }
  function walk(node) {
    const preText = getText(node.startIndex);
    const children = node.children.map(walk);
    const text = getText(node.endIndex);
    const isLeaf = children.length === 0 && node.type === text[0];
    if (isLeaf) return [...preText, ...text];
    return [...preText, [node.type, ...[].concat(...children), ...text]];
  }
  return ["root", ...walk(ast.rootNode), ...getText(code.length)];
}

function printSexp(sexp) {
  const str = JSON.stringify(sexp);
  return prettier.format(str, {parser: "json"});
}

function printHtml(sexp) {
  function print(node) {
    if (typeof node === "string") return node;
    const [type, ...children] = node;
    return `<span class="${type}">${children.map(print).join("")}</span>`;
  }
  return `<pre>${print(sexp)}</pre>`;
}

module.exports = { partialSexp, fullSexp, printSexp, printHtml };
