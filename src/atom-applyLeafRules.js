// PASTED FROM: https://github.com/atom/atom/blob/v1.33.0/src/tree-sitter-language-mode.js#L1024-L1045

const applyLeafRules = (rules, cursor) => {
  if (!rules || typeof rules === 'string') return rules
  if (Array.isArray(rules)) {
    for (let i = 0, {length} = rules; i !== length; ++i) {
      const result = applyLeafRules(rules[i], cursor)
      if (result) return result
    }
    return undefined
  }
  if (typeof rules === 'object') {
    if (rules.exact) {
      return cursor.nodeText === rules.exact
        ? applyLeafRules(rules.scopes, cursor)
        : undefined
    }
    if (rules.match) {
      return rules.match.test(cursor.nodeText)
        ? applyLeafRules(rules.scopes, cursor)
        : undefined
    }
  }
}

module.exports = { applyLeafRules };
