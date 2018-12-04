// Demonstrate usage

const { partialSexp, fullSexp, renameSexp, flattenSexp, highlightSexp, printSexp } = require('./index.js');
const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');

const parser = new Parser();
parser.setLanguage(JavaScript);

const text = `
function foo() {
  return 1;
}`;
const tree = parser.parse(text);

// util to print the literal form of the s-expression
// (js arrays instead of the prettier s-expressions)
const prettier = require('prettier');
const printArray = arr => prettier.format(JSON.stringify(arr), {parser:"json"});

console.log(`
======================================================================
Parsing text:
======================================================================
${text}
`);

const partial = partialSexp(tree);
console.log(`
======================================================================
Partial Tree:
- only named node types are shown
- (no text)
======================================================================

${printSexp(partial)}
`);

const full = fullSexp(text, tree);
console.log(`
======================================================================
Full Tree:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

${printSexp(full)}
`);

const highlight = highlightSexp(full, (node, path) => {
  const [name] = node;
  if (name === "identifier") return ["syntax--identifier"];
  return [];
});

console.log(`
======================================================================
Highlighted Tree:
======================================================================

CLASSES APPENDED TO NODE NAMES:
${printSexp(highlight.renamedSexp)}

NODES WITHOUT CLASSES FLATTENED:
${printSexp(highlight.sexp)}
`);

console.log(`
======================================================================
HTML:
======================================================================
${highlight.html}
`);
