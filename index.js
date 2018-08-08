var diff = require('crgmw-diff')
var jsonolt = require('jsonolt')

module.exports = function (before, after) {
  // Step 1: Encode values as ordered, labeled trees.
  var beforeOLT = jsonolt.encode(before)
  var afterOLT = jsonolt.encode(after)

  // Step 2: Diff the OLTs.
  var result = diff(beforeOLT, afterOLT)

  // Step 3: Convert crgmw-diff operations to RFC 6902 operations.
  return convertEditOperations(result)
}

// jsonolt nodes have one of eight types:
//
// 1. Value Types: null, number, string, boolean
// 2. Composite Types: array, object
// 3. Member Types: index (arrays), key (objects)

function valueOfNode (node) {
  var label = node.label
  var type = label.type
  /* istanbul ignore if */
  if (type === 'index' || type === 'key') {
    throw new Error(
      'no value for node of type ' +
      JSON.stringify(type)
    )
  }
  if (type === 'object') return {}
  if (type === 'array') return []
  return label.value
}

function convertEditOperations (result) {
  var editScript = result.editScript
  var dummyRoots = result.dummyRoots
  var returned = []
  editScript.forEach(function (element) {
    var operation = element.operation
    var node = element.node
    var label = node.label
    var type = label.type

    // crgmw-diff returns operations of four types:
    //
    // 1. insert (node, index)
    // 2. delete (node)
    // 3. update (node, value)
    // 4. move (node, parent, index)
    //
    // In addition, crgmw-diff may or may not create dummy roots for the
    // trees it diffs.

    // RFC 6902 defines different operation types:
    //
    // 1. add (path, value)
    // 2. remove (path)
    // 3. replace (path, value)
    // 4. move (path, value)
    // 5. copy (from, path)
    // 6. test (path, value)

    if (operation === 'insert') {
      // jsonolt encodes array elements and object
      // properties as only children of index and key nodes,
      // not direct children of array and object parents:
      //
      // - type: array
      //   children:
      //     - type: index
      //       value: 0
      //       children:
      //         - type: string
      //           value: 'x'
      //
      // - type: object
      //   children:
      //     - type: key
      //       value: 'a'
      //       children:
      //         - type: number
      //           value: 1
      //
      // When elements or properties get added, crgmw-diff
      // edit scripts contain insert operations both for
      // indexes and keys, and for element and property
      // values.
      //
      // Ignore insert operations on indexes and keys. We
      // will see insert operations for the _values_ at the
      // new indexes and keys later in edit scripts.
      if (type === 'index') return
      if (type === 'key') return

      // crgmw-diff insert operations don't have parent
      // properties. Rather, inserted nodes carry pointers
      // to their new parents.
      var nodeParent = node.parent
      if (nodeParent.root) {
        if (dummyRoots) {
          returned.push({
            op: 'replace',
            path: [],
            value: valueOfNode(node)
          })
        } else {
          throw new Error('insert into root without dummy roots')
        }
        return
      }
      returned.push({
        op: 'add',
        value: valueOfNode(node),
        path: pathOfNode(node)
      })
    } else if (operation === 'delete') {
      // Only process delete operations on object keys and
      // array elements.
      if (type !== 'index' && type !== 'key') return
      var path = pathOfNode(node)

      // Ignore operations to delete roots.
      if (path.length === 0) {
        if (!dummyRoots) {
          throw new Error('delete root without dummy roots')
        } else return
      }

      var coveredByPrior = false
      for (var index = 0; index < returned.length; index++) {
        var prior = returned[index]
        if (pathWithinPath(path, prior.path)) {
          if (prior.op === 'remove') {
            prior.path = path
            coveredByPrior = true
          } else if (prior.op === 'add') {
            coveredByPrior = true
          }
        }
      }
      if (coveredByPrior) return
      returned.push({
        op: 'remove',
        path: pathOfNode(node)
      })
    } else if (operation === 'update') {
    } else if (operation === 'move') {
      // var parent = element.parent
    } else {
      throw new Error('invalid operation: ' + JSON.stringify(operation))
    }
  })
  return returned
}

function pathOfNode (node) {
  // Compute the JSON Path of an OLT node.
  var keys = []
  recurseKeys(node, keys)
  // Since we recurse from children to parents, and JSON
  // Paths start from the root, reverse our list of keys.
  keys.reverse()
  return keys
}

// Helper function for pathOfNode that follows OLT node
// parent pointers back to the root node, collecting object
// keys and array indexes.
function recurseKeys (node, keys) {
  if (node.root) return
  var parent = node.parent
  var label = node.label
  var type = label.type
  if (type === 'index' || type === 'key') keys.push(label.value)
  recurseKeys(parent, keys)
}

function pathWithinPath (parent, child) {
  if (child.length < parent.length) return false
  for (var index = 0; index < parent.length; index++) {
    if (parent[index] !== child[index]) return false
  }
  return true
}
