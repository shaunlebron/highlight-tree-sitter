# Highlight Tree Sitter

[Atom has a new syntax highlighter][scope mappings] using [tree-sitter] which works better than hacky regexes.

It is designed for editors, but this project uses it to:

- **generate HTML snippets** for syntax-highlighting static code
- **pretty-print s-expressions** of syntax trees for learning
- **provide a platform for analysis** so it can be used for generating other things, like:
    - wrapping recognized symbols in `<a href>` links for docs
    - outputting ansi-highlighted code for terminal, or other formats

This is currently only a **low-level API** for accomplishing the above things.

## Learn!

_Code below is a walkthrough of what [demo.js](demo.js) does_

Suppose we have the following JavaScript code we want to highlight:

```
function foo() {
  return 1;
}
```

**Partial Tree**: Passing it to `partialSexp` will create the partial tree seen
below—not containing any actual source text, and only displaying what are
called _named_ nodes, giving you an overview of the syntax tree.

_NOTE: This s-expression format is what tree-sitter uses in its own test
cases, but we provide a facility to represent it as arrays and to print it with
proper formatting using `printSexp`, which is used in these examples)_

```
(program
  (function
    (identifier)
    (formal_parameters) 
    (statement_block (return_statement (number)))))
```

**Full Tree**: Passing it to `fullSexp` will instead create a full tree, with
source text and whitespace with a root node `_root` capturing outer whitespace,
and anonymous nodes `_anon` capturing what tree-sitter calls _unnamed nodes_.

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

**Annotated Tree**: Passing the full tree to `highlightSexp` with Atom's
[javascript grammar scopes][js-scopes] (see [scope mappings]) produces the tree
below.  Each syntax node is annotated with matching class names from the scope
mappings:

```
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

**Highlight Tree**: Since we do not need any unannotated syntax nodes, we
create a new tree with only the highlighted nodes, flattening all others:

```
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

**HTML output**: We can then directly map the highlight tree s-expressions to
html span tags below:

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
[js-scopes]:https://github.com/atom/language-javascript/blob/v0.129.18/grammars/tree-sitter-javascript.cson#L58
