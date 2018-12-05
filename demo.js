// Demonstrate usage

const { partialSexp, fullSexp, flattenSexp, highlightSexpFromScopes, printSexp } = require('./index.js');
const Parser = require('tree-sitter');
const Javascript = require('tree-sitter-javascript');
const CSON = require('cson');
const JavascriptGrammar = CSON.requireFile('./node_modules/language-javascript/grammars/tree-sitter-javascript.cson');

const parser = new Parser();
parser.setLanguage(Javascript);

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

const highlight = highlightSexpFromScopes(full, JavascriptGrammar.scopes);
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
