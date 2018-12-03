// Demonstrate usage

const { partialSexp, fullSexp, printSexp, printHtml } = require('./index.js');
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

======================================================================
Partial Tree:
- only named node types are shown
- (no text)
======================================================================

${printSexp(partialSexp(tree))}

As array:
${printArray(partialSexp(tree))}

======================================================================
Full Tree:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

${printSexp(fullSexp(text, tree))}

As array:
${printArray(fullSexp(text, tree))}

======================================================================
HTML:
-  each node is wrapped in <span class="<name>"></span>
======================================================================

${printHtml(fullSexp(text, tree))}
`);
