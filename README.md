_work in progress_

# Highlight Tree Sitter

Create syntax-highlighted code (in HTML) from proper [tree-sitter] grammars.

- **Why**: it's better since it doesn't use incorrect regex patterns
- **How**: this adds helpers to the node.js bindings for tree-sitter

_**TODO**: implement Atom's [scope mappings] to create classes from syntax node selections_

## Quick example

Code to parse (JavaScript):

```
function foo() {
  return 1;
}
```

Partial Tree:

```
(program
  (function
    (identifier)
    (formal_parameters) 
    (statement_block (return_statement (number)))))
```

Full Tree:

```
(_root
  "\n"
  (program
    (function
      (_anon "function")
      " "
      (identifier "foo")
      (formal_parameters (_anon "(") (_anon ")"))
      " "
      (statement_block
        (_anon "{")
        "\n  "
        (return_statement (_anon "return") " " (number "1") (_anon ";"))
        "\n" 
        (_anon "}")))))
```

Highlight Tree (only highlighting _identifiers_):

<pre>
CLASSES APPENDED TO NODE NAMES:
(_root
  "\n"
  (program
    (function
      (_anon "function")
      " "
      (identifier<strong>.syntax--identifier</strong> "foo")
      (formal_parameters (_anon "(") (_anon ")"))
      " "
      (statement_block
        (_anon "{")
        "\n  "
        (return_statement (_anon "return") " " (number "1") (_anon ";"))
        "\n"
        (_anon "}")))))
</pre>

<pre>
NODES WITHOUT CLASSES FLATTENED:
(_root
  "\nfunction "
  (identifier<strong>.syntax--identifier</strong> "foo")
  "() {\n  return 1;\n}")
</pre>

Output html:

```
function <span class="syntax--identifier">foo</span>() {
  return 1;
}
```

## API

For the following signatures, `tree` is the output of tree-sitter parser on `text`, and `sexp` is nested array of strings and arrays (s-expressions).

- `partialSexp(tree) => sexp` - create partial s-expression from tree (no text or unnamed nodes)
- `fullSexp(text, tree) => sexp` - create full s-expression from source text and tree
- `printHtml(sexp) => str` - create html string to highlight a full s-expression (i.e. result of fullSexp)
- `printSexp(sexp) => str` - pretty-print an s-expression

## Run the demo

Run [demo.js](demo.js) to see the following example for highlighting JavaScript:

```
npm install
node demo.js
```

## Dev

The s-expression pretty-printer is compiled ClojureScript code.  To rebuild:

```
npm run build
```

[tree-sitter]:https://github.com/tree-sitter/tree-sitter
[scope mappings]:https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting

