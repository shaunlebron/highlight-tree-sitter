(ns sexp.core
  (:require [cljs.pprint :refer [pprint]]))

(defn array->sexp [arr]
  (if-not (array? arr)
    arr
    (let [[_name & others] arr]
      (cons (symbol _name) (map array->sexp others)))))

(defn ^:export pprintArrayAsSexp [arr]
  (with-out-str
    (pprint (array->sexp arr))))

