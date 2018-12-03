# Highlight Tree Sitter

Create a Highlight Syntax Tree (HST) from text using a [tree-sitter] grammar.

[tree-sitter]:https://github.com/tree-sitter/tree-sitter

```
$ node demo.js


======================================================================
Parsing code:
======================================================================

(defn foo
  "hello, this is a docstring"
  [a b]
  (let [sum (+ a b)
        prod (* a b)]
     {:sum sum
      :prod prod}))

======================================================================
Partial s-expression:
- only named node types are shown
- (no text)
======================================================================

(program
  (defn
    (function_name (symbol))
    (docstring (string))
    (params (vector (symbol) (symbol)))
    (function_body
      (list
        (symbol)
        (vector
          (symbol)
          (list (symbol) (symbol) (symbol))
          (symbol)
          (list (symbol) (symbol) (symbol)))
        (hash_map (keyword) (symbol) (keyword) (symbol))))))

======================================================================
Full s-expression:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

(_root
  "\n"
  (program
    (defn
      (_anon "(")
      (_anon "defn")
      " "
      (function_name (symbol "foo"))
      "\n  "
      (docstring
        (string (_anon "\"") "hello, this is a docstring" (_anon "\"")))
      "\n  "
      (params
        (vector (_anon "[") (symbol "a") " " (symbol "b") (_anon "]")))
      "\n  "
      (function_body
        (list
          (_anon "(")
          (symbol "let")
          " "
          (vector
            (_anon "[")
            (symbol "sum")
            " "
            (list
              (_anon "(")
              (symbol "+")
              " "
              (symbol "a")
              " "
              (symbol "b")
              (_anon ")"))
            "\n        "
            (symbol "prod")
            " "
            (list
              (_anon "(")
              (symbol "*")
              " "
              (symbol "a")
              " "
              (symbol "b")
              (_anon ")"))
            (_anon "]"))
          "\n     "
          (hash_map
            (_anon "{")
            (keyword (_anon ":") "sum")
            " "
            (symbol "sum")
            "\n      "
            (keyword (_anon ":") "prod")
            " " 
            (symbol "prod") 
            (_anon "}")) 
          (_anon ")"))) 
      (_anon ")"))))

======================================================================
HTML:
-  each node is wrapped in <span class="<name>"></span>
======================================================================

<pre><span class="_root">
<span class="program"><span class="defn"><span class="_anon">(</span><span class="_anon">defn</span> <span class="function_name"><span class="symbol">foo</span></span>
  <span class="docstring"><span class="string"><span class="_anon">"</span>hello, this is a docstring<span class="_anon">"</span></span></span>
  <span class="params"><span class="vector"><span class="_anon">[</span><span class="symbol">a</span> <span class="symbol">b</span><span class="_anon">]</span></span></span>
  <span class="function_body"><span class="list"><span class="_anon">(</span><span class="symbol">let</span> <span class="vector"><span class="_anon">[</span><span class="symbol">sum</span> <span class="list"><span class="_anon">(</span><span class="symbol">+</span> <span class="symbol">a</span> <span class="symbol">b</span><span class="_anon">)</span></span>
        <span class="symbol">prod</span> <span class="list"><span class="_anon">(</span><span class="symbol">*</span> <span class="symbol">a</span> <span class="symbol">b</span><span class="_anon">)</span></span><span class="_anon">]</span></span>
     <span class="hash_map"><span class="_anon">{</span><span class="keyword"><span class="_anon">:</span>sum</span> <span class="symbol">sum</span>
      <span class="keyword"><span class="_anon">:</span>prod</span> <span class="symbol">prod</span><span class="_anon">}</span></span><span class="_anon">)</span></span></span><span class="_anon">)</span></span></span></span></pre>

```
