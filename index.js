const prettier = require('prettier');

function highlightTree(code, ast) {
  const tags = [];
  function walk(node) {
    const { type, startIndex, endIndex, children } = node;
    tags.push({type, i: startIndex, isOpen: true});
    children.forEach(walk);
    tags.push({type, i: endIndex, isOpen: false});
  }
  walk(ast.rootNode);

  let prevI = 0;
  let sexp = `["root",`;
  for (const { type, i, isOpen } of tags) {
    const prevText = code.slice(prevI, i);
    if (prevText) sexp += JSON.stringify(prevText) + ",";
    sexp += (isOpen ? "[" + JSON.stringify(type) : "]") + ",";
    prevI = i;
  }
  sexp += "]";
  return eval(sexp);
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
