// Demonstrate usage

const { partialSexp, fullSexp, printSexp, printHtml } = require('./index.js');
const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = `
function foo() {
  return 1;
}`;
const ast = parser.parse(code);

// util to print the literal form of the s-expression
// (js arrays instead of the prettier s-expressions)
const prettier = require('prettier');
const printArray = arr => prettier.format(JSON.stringify(arr), {parser:"json"});


console.log(`
======================================================================
Parsing code:
======================================================================
${code}

======================================================================
Partial:
- only named node types are shown
- (no text)
======================================================================

S-EXPRESSION:
${printSexp(partialSexp(ast))}

ARRAY:
${printArray(partialSexp(ast))}

======================================================================
Full:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

S-EXPRESSION:
${printSexp(fullSexp(code, ast))}

ARRAY:
${printArray(fullSexp(code, ast))}

======================================================================
HTML:
-  each node is wrapped in <span class="<name>"></span>
======================================================================

${printHtml(fullSexp(code, ast))}
`);
