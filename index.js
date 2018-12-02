const prettier = require('prettier');

function highlightTree(code, ast) {
  let a = 0;
  function getText(b) {
    let text = code.slice(a, b);
    a = b;
    return text ? [text] : [];
  }
  function walk(node) {
    return [
      ...getText(node.startIndex),
      [
        node.type,
        ...[].concat(...node.children.map(walk)),
        ...getText(node.endIndex)
      ]
    ];
  }
  return ["root", ...walk(ast.rootNode), ...getText(code.length)];
}

function printHighlightTree(hst) {
  const str = JSON.stringify(hst);
  return prettier.format(str, {parser: "json"});
}

function printHighlightHtml(hst) {
  let result = "";
  function walk(node) {
    if (typeof node === "string")
      result += node;
    else {
      const [type, ...children] = node;
      if (children[0] === type && children.length === 1) result += type;
      else {
        result += `<span class="${type}">`;
        children.forEach(walk);
        result += "</span>";
      }
    }
  }
  walk(hst);
  return `<pre>${result}</pre>`;
}

module.exports = { highlightTree, printHighlightTree, printHighlightHtml };
