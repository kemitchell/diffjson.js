var editScript = require('../edit-script')
var util = require('util')
var tape = require('tape')

tape('array insert', function (t) {
  var script = editScript(['a'], ['a', 'b'])
  t.assert(
    script.some(function (element) {
      return (
        isInsert(element) &&
        element.index === 0 &&
        hasLabel(element, {type: 'index', value: 1})
      )
    }),
    'inserts index'
  )
  t.assert(
    script.some(function (element) {
      return (
        isInsert(element) &&
        element.index === 0 &&
        hasLabel(element, {type: 'string', value: 'b'})
      )
    }),
    'inserts string'
  )
  t.equal(script.length, 2, '2 operations')
  t.end()
})

tape('array delete', function (t) {
  var script = editScript(['a', 'b'], ['a'])
  t.assert(
    script.some(function (element) {
      return (
        element.operation === 'delete' &&
        hasLabel(element, {type: 'string', value: 'b'})
      )
    }),
    'deletes string'
  )
  t.assert(
    script.some(function (element) {
      return (
        isDelete(element) &&
        hasLabel(element, {type: 'index', value: 1})
      )
    }),
    'deletes index'
  )
  t.equal(script.length, 2, '2 operations')
  t.end()
})

tape.only('array swap', function (t) {
  var script = editScript(['a', 'b'], ['b', 'a'])
  script.forEach(function (element) {
    console.log(util.inspect(element, {depth: 4}))
  })
  t.equal(script.length, 2, '2 operations')
  t.end()
})

function isInsert (element) {
  return element.operation === 'insert'
}

function isDelete (element) {
  return element.operation === 'delete'
}

function hasLabel (element, expected) {
  if (!element.hasOwnProperty('node')) return false
  if (!element.node.hasOwnProperty('label')) return false
  var keys = Object.keys(expected)
  var label = element.node.label
  for (var index = 0; index < keys.length; index++) {
    var key = keys[index]
    if (label[key] !== expected[key]) return false
  }
  return true
}
