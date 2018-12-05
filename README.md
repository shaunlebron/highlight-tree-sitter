_work in progress_

# Highlight Tree Sitter

Create syntax-highlighted code (in HTML) from proper [tree-sitter] grammars.

- **Why**: it's better since it doesn't use incorrect regex patterns
- **How**: this adds helpers to the node.js bindings for tree-sitter

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

Highlight Tree:

```
CLASSES APPENDED TO NODE NAMES:
(_root
  "\n"
  (program.source.js
    (function
      (_anon.storage.type "function")
      " "
      (identifier.entity.name.function "foo")
      (formal_parameters
        (_anon.punctuation.definition.parameters.begin.bracket.round "(")
        (_anon.punctuation.definition.parameters.end.bracket.round ")"))
      " "
      (statement_block
        (_anon.punctuation.definition.function.body.begin.bracket.curly
          "{")
        "\n  "
        (return_statement
          (_anon.keyword.control "return")
          " "
          (number.constant.numeric "1")
          (_anon ";"))
        "\n"
        (_anon.punctuation.definition.function.body.end.bracket.curly
          "}")))))
```

```
NODES WITHOUT CLASSES FLATTENED:
(_root
  "\n"
  (program.source.js
    (_anon.storage.type "function")
    " "
    (identifier.entity.name.function "foo")
    (_anon.punctuation.definition.parameters.begin.bracket.round "(")
    (_anon.punctuation.definition.parameters.end.bracket.round ")")
    " "
    (_anon.punctuation.definition.function.body.begin.bracket.curly "{")
    "\n  "
    (_anon.keyword.control "return")
    " "
    (number.constant.numeric "1")
    ";\n"
    (_anon.punctuation.definition.function.body.end.bracket.curly "}")))
```

Output html:

```
<span class="source js"><span class="storage type">function</span> <span class="entity name function">foo</span><span class="punctuation definition parameters begin bracket round">(</span><span class="punctuation definition parameters end bracket round">)</span> <span class="punctuation definition function body begin bracket curly">{</span>
  <span class="keyword control">return</span> <span class="constant numeric">1</span>;
<span class="punctuation definition function body end bracket curly">}</span></span>
```

## API

For the following signatures, `tree` is the output of tree-sitter parser on `text`, and `sexp` is nested array of strings and arrays (s-expressions).

- `partialSexp(tree) => sexp` - create partial s-expression from tree (no text or unnamed nodes)
- `fullSexp(text, tree) => sexp` - create full s-expression from source text and tree
- `printSexp(sexp) => str` - pretty-print an s-expression

Highlighting:

- `highlightSexpFromScopes(sexp, scopes) => { html, sexp }` - highlight using Atom [scope mappings]

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

