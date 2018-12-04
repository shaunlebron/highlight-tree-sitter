;; Pretty-print a JS array as an s-expression.
;; (for better visualizing our API output below)
;;
;; Uses ClojureScript's builtin pretty-printer, with some processing to force two-space indentation.

(ns src.print
  (:require
    [clojure.string :refer [join split-lines replace-first]]
    [clojure.pprint :refer [pprint]]))

(defn array->sexp [arr]
  (if-not (array? arr)
    arr
    (let [[_name & others] arr]
      (cons (symbol _name) (map array->sexp others)))))

(defn reindent-line
  "double the indentation of a given line"
  [line]
  (replace-first line #"^\s+" #(str % %)))

(defn reindent-lines [text]
  (->> (split-lines text)
       (map reindent-line)
       (join "\n")))

(defn print-array-as-sexp [arr]
  (reindent-lines
    (with-out-str (pprint (array->sexp arr)))))

(defn exports []
  #js {:printSexp print-array-as-sexp})
