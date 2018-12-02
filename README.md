# Highlight Tree Sitter

Create a Highlight Syntax Tree (HST) from text using a [tree-sitter] grammar.

[tree-sitter]:https://github.com/tree-sitter/tree-sitter

```
$ node demo.js

======================================================================
PARSING CODE:

(defn foo
  "hello, this is a docstring"
  [a b]
  (let [sum (+ a b)
        prod (* a b)]
     {:sum sum
      :prod prod}))
======================================================================
AST:
(program (defn (function_name (symbol)) (docstring (string)) (params (vector (symbol) (symbol))) (function_body (list (symbol) (vector (symbol) (list (symbol) (symbol) (symbol)) (symbol) (list (symbol) (symbol) (symbol))) (hash_map (keyword) (symbol) (keyword) (symbol))))))
======================================================================
Partial s-expression:
[
  "program",
  [
    "defn",
    ["function_name", ["symbol"]],
    ["docstring", ["string"]],
    ["params", ["vector", ["symbol"], ["symbol"]]],
    [
      "function_body",
      [
        "list",
        ["symbol"],
        [
          "vector",
          ["symbol"],
          ["list", ["symbol"], ["symbol"], ["symbol"]],
          ["symbol"],
          ["list", ["symbol"], ["symbol"], ["symbol"]]
        ],
        ["hash_map", ["keyword"], ["symbol"], ["keyword"], ["symbol"]]
      ]
    ]
  ]
]

======================================================================
Full s-expression:
[
  "root",
  "\n",
  [
    "program",
    [
      "defn",
      "(",
      "defn",
      " ",
      ["function_name", ["symbol", "foo"]],
      "\n  ",
      ["docstring", ["string", "\"", "hello, this is a docstring", "\""]],
      "\n  ",
      ["params", ["vector", "[", ["symbol", "a"], " ", ["symbol", "b"], "]"]],
      "\n  ",
      [
        "function_body",
        [
          "list",
          "(",
          ["symbol", "let"],
          " ",
          [
            "vector",
            "[",
            ["symbol", "sum"],
            " ",
            [
              "list",
              "(",
              ["symbol", "+"],
              " ",
              ["symbol", "a"],
              " ",
              ["symbol", "b"],
              ")"
            ],
            "\n        ",
            ["symbol", "prod"],
            " ",
            [
              "list",
              "(",
              ["symbol", "*"],
              " ",
              ["symbol", "a"],
              " ",
              ["symbol", "b"],
              ")"
            ],
            "]"
          ],
          "\n     ",
          [
            "hash_map",
            "{",
            ["keyword", ":", "sum"],
            " ",
            ["symbol", "sum"],
            "\n      ",
            ["keyword", ":", "prod"],
            " ",
            ["symbol", "prod"],
            "}"
          ],
          ")"
        ]
      ],
      ")"
    ]
  ]
]

======================================================================
HTML:
<pre><span class="root">
<span class="program"><span class="defn">(defn <span class="function_name"><span class="symbol">foo</span></span>
  <span class="docstring"><span class="string">"hello, this is a docstring"</span></span>
  <span class="params"><span class="vector">[<span class="symbol">a</span> <span class="symbol">b</span>]</span></span>
  <span class="function_body"><span class="list">(<span class="symbol">let</span> <span class="vector">[<span class="symbol">sum</span> <span class="list">(<span class="symbol">+</span> <span class="symbol">a</span> <span class="symbol">b</span>)</span>
        <span class="symbol">prod</span> <span class="list">(<span class="symbol">*</span> <span class="symbol">a</span> <span class="symbol">b</span>)</span>]</span>
     <span class="hash_map">{<span class="keyword">:sum</span> <span class="symbol">sum</span>
      <span class="keyword">:prod</span> <span class="symbol">prod</span>}</span>)</span></span>)</span></span></span></pre>
```
