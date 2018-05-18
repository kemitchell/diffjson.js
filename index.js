var diff = require('crgmw-diff')
var jsonolt = require('jsonolt')

module.exports = function (a, b) {
  var aTree = jsonolt.encode(a)
  var bTree = jsonolt.encode(b)
  var result = diff(aTree, bTree)
  return postprocess(result)
}

function postprocess (result) {
  return detectReplacements(
    mapOLTOperations(
      result.editScript
    )
  )
}

function mapOLTOperations (editScript) {
  var returned = []
  editScript.forEach(function (element) {
    var operation = element.operation
    var node = element.node
    var label
    if (operation === 'insert') {
      label = node.label
      if (label.type === 'key') return
      var parent = node.parent
      var oltPath = pathOf(parent).concat(element.index)
      returned.push({
        operation: 'insert',
        value: valueOf(node),
        path: oltPathToJSONPath(oltPath)
      })
    } else if (operation === 'delete') {
      label = node.label
      if (label.type === 'key') return
      returned.push({
        operation: 'delete',
        path: element.node.path
      })
    } else {
      returned.push(element)
    }
  })
  return returned
}

function detectReplacements (editScript) {
  var insertions = []
  var deletions = []
  var other = []
  editScript.forEach(function (element) {
    var operation = element.operation
    if (operation === 'insert') insertions.push(element)
    else if (operation === 'delete') deletions.push(element)
    else other.push(element)
  })
  var returned = []
  insertions.forEach(function (insertion) {
    if (pathAmong(insertion, deletions)) {
      returned.push({
        operation: 'replace',
        value: insertion.value,
        path: insertion.path
      })
    } else {
      returned.push(insertion)
    }
  })
  deletions.forEach(function (deletion) {
    if (!pathAmong(deletion, insertions)) returned.push(deletion)
  })

  return returned.concat(other)

  function pathAmong (element, array) {
    var path = element.path
    return array.some(function (otherElement) {
      return sameArray(path, otherElement.path)
    })
  }
}

function sameArray (a, b) {
  var aLength = a.length
  var bLength = b.length
  if (aLength !== bLength) return false
  for (var index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return false
  }
  return true
}

function pathOf (node, path) {
  path = path || []
  var parent = node.parent
  if (parent) {
    var label = node.label
    var type = label.type
    if (type === 'key') path.push(label.value)
    else path.push(parent.children.indexOf(node))
    return pathOf(parent, path)
  } else {
    path.reverse()
    return path
  }
}

function valueOf (node) {
  var label = node.label
  var type = label.type
  if (type === 'object') return {}
  if (type === 'array') return []
  return label.value
}

function oltPathToJSONPath (oltPath) {
  var returned = []
  oltPath.slice(1).forEach(function (element, index, iterating) {
    if (index === 0 || typeof iterating[index - 1] !== 'string') {
      returned.unshift(element)
    }
  })
  returned.reverse()
  return returned
}
