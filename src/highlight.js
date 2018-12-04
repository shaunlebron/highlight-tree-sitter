const { renameSexp, flattenSexp, stringifySexp } = require("./transform.js");

const SyntaxScopeMap = require("./atom-SyntaxScopeMap.js");
const applyLeafRules = require("./atom-applyLeafRules.js");

function highlightSexp(sexp, getNodeClasses) {
  const renamedSexp = renameSexp(sexp, (node, path) => [node[0], ...getNodeClasses(node, path)].join("."));
  sexp = flattenSexp(renamedSexp, node => !node[0].includes("."));
  const html = stringifySexp(sexp, (name, childrenStrs) => {
    const className = name.split(".").slice(1).join(" ");
    const inner = childrenStrs.join("");
    return className ? `<span class="${className}">${inner}</span>` : inner;
  });
  return {html, sexp, renamedSexp};
}

// Atom Scope Mappings:
// https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting
function highlightWithAtomScopes(sexp, scopes) {
  // TODO ...
}

module.exports = { highlightSexp };
