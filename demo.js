const Parser = require('tree-sitter');
const Clojure = require('tree-sitter-clojure');
const { highlightTree, printHighlightTree, printHighlightHtml } = require('./index.js');

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

console.log("======================================================================");
console.log("PARSING CODE:");
console.log(code);

console.log("======================================================================");
console.log("AST:");
const ast = parser.parse(code);
console.log(ast.rootNode.toString());

console.log("======================================================================");
console.log("HST:");
const hst = highlightTree(code, ast);
console.log(printHighlightTree(hst));

console.log("======================================================================");
console.log("HTML:");
console.log(printHighlightHtml(hst));

