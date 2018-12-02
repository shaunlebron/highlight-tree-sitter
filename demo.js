const Parser = require('tree-sitter');
const Clojure = require('tree-sitter-clojure');
const { partialSexp, fullSexp, printSexp, printHtml } = require('./index.js');

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
console.log("Partial s-expression:");
console.log(printSexp(partialSexp(ast)));

console.log("======================================================================");
console.log("Full s-expression:");
console.log(printSexp(fullSexp(code, ast)));

console.log("======================================================================");
console.log("HTML:");
console.log(printHtml(fullSexp(code, ast)));

