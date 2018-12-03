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

Highlight Tree:

<pre>
TODO: transform from Full Tree using <a href="https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting">scope mappings</a>
</pre>

Output html (using Full Tree for now):

```
<pre><span class="_root">
<span class="program"><span class="function"><span class="_anon">function</span> <span class="identifier">foo</span><span class="formal_parameters"><span class="_anon">(</span><span class="_anon">)</span></span> <span class="statement_block"><span class="_anon">{</span>
  <span class="return_statement"><span class="_anon">return</span> <span class="number">1</span><span class="_anon">;</span></span>
<span class="_anon">}</span></span></span></span></span></pre>
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

