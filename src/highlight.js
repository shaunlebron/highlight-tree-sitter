const { flattenSexp, stringifySexp } = require("./transform.js");

const SyntaxScopeMap = require("./atom-SyntaxScopeMap.js");
const applyLeafRules = require("./atom-applyLeafRules.js");

function renameSexpWithCursor(sexp, rename) {
  function walk(node, nodeTypes, childIndices) {
    const [name, ...children] = node;
    const newName = rename(node, nodeTypes, childIndices);
    let i = 0;
    const newChildren = children.map(child => {
      if (typeof child === "string") return child;
      const newNodeTypes = [...nodeTypes, child[0]];
      const newChildIndices = [...childIndices, i++];
      return walk(child, newNodeTypes, newChildIndices);
    });
    return [newName, ...newChildren];
  }
  return walk(sexp, [], []);
}

function highlightSexp(sexp, getNodeClasses) {
  const renamedSexp = renameSexpWithCursor(sexp, (node, ...cursor) => [node[0], ...getNodeClasses(node, ...cursor)].join("."));
  sexp = flattenSexp(renamedSexp, node => !node[0].includes("."));
  const html = stringifySexp(sexp, (name, childrenStrs) => {
    const className = name.split(".").slice(1).join(" ");
    const inner = childrenStrs.join("");
    return className ? `<span class="${className}">${inner}</span>` : inner;
  });
  return {html, sexp, renamedSexp};
}

function getNodeText(node) {
  if (typeof node === "string") return node;
  const [name, ...children] = node;
  return children.map(getNodeText).join("");
}

// Needed by Atom's applyLeafRules
function getNodeCursor(node) {
  return { get nodeText() { return getNodeText(node); } };
}

// Atom Scope Mappings:
// https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting
function highlightSexpFromScopes(sexp, scopes) {
  const scopeMap = new SyntaxScopeMap(scopes);
  return highlightSexp(sexp, (node, nodeTypes, childIndices) => {
    const rules = scopeMap.get(nodeTypes, childIndices);
    const cursor = getNodeCursor(node);
    const scopeName = applyLeafRules(rules, cursor);
    if (!scopeName) return [];
    return scopeName.split(".");
  });
}

module.exports = { highlightSexp, highlightSexpFromScopes };
