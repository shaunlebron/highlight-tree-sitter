// Transform s-expressions into something else.
// (e.g. another s-expression or string)

function mergeContiguousStrings(nodes) {
  const result = [];
  for (const node of nodes)
    if (typeof result[result.length-1] === "string" && typeof node === "string")
      result[result.length-1] += node;
    else
      result.push(node);
  return result;
}

function flattenSexp(sexp, shouldFlatten) {
  function walk(node) {
    if (typeof node === "string") return node;
    const [name, ...children] = node;
    const newChildren = [].concat(...children.map(child => {
      const flat = Array.isArray(child) && shouldFlatten(child);
      const newChild = walk(child);
      return flat ? newChild.slice(1) : [newChild];
    }));
    return [name, ...mergeContiguousStrings(newChildren)];
  }
  return walk(sexp);
}

function stringifySexp(sexp, stringify) {
  function print(node) {
    if (typeof node === "string") return node;
    const [name, ...children] = node;
    return stringify(name, children.map(print));
  }
  return print(sexp);
}

module.exports = { flattenSexp, stringifySexp };
