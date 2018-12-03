// Demonstrate usage

const Parser = require('tree-sitter');
const Clojure = require('tree-sitter-clojure');
const { partialSexp, fullSexp, printHtml } = require('./index.js');
const { printSexp } = require('./printSexp.js');

const parser = new Parser();
parser.setLanguage(Clojure);

const code = `
(defn foo
  "hello, this is a docstring"
  [a b]
  (let [sum (+ a b)
        prod (* a b)]
     {:sum sum
      :prod prod}))`;
const ast = parser.parse(code);

console.log(`
======================================================================
Parsing code:
======================================================================
${code}

======================================================================
Partial s-expression:
- only named node types are shown
- (no text)
======================================================================

${printSexp(partialSexp(ast))}

======================================================================
Full s-expression:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

${printSexp(fullSexp(code, ast))}

======================================================================
HTML:
-  each node is wrapped in <span class="<name>"></span>
======================================================================

${printHtml(fullSexp(code, ast))}
`);
