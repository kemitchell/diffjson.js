var editScript = require('./edit-script')

module.exports = function (a, b) {
  return postprocess(editScript(a, b))
}

function postprocess (script) {
  mapOLTOperations(script)
}

function mapOLTOperations (script) {
  var returned = []
  script.forEach(function (element) {
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
