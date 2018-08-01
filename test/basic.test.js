var tape = require('tape')
var diffjson = require('../')

var identical = {
  objects: [{}, {}],
  arrays: [[], []],
  booleans: [true, true],
  numbers: [1, 1],
  strings: ['x', 'x']
}

Object.keys(identical).forEach(function (key) {
  tape('identical ' + key, function (t) {
    var inputs = identical[key]
    var result = diffjson(inputs[0], inputs[1])
    t.deepEqual(result, [])
    t.end()
  })
})

tape('one property', function (t) {
  var a = {a: 1}
  var b = {a: 2}
  var result = diffjson(a, b)
  t.deepEqual(result, [
    {
      operation: 'replace',
      path: [],
      value: {}
    },
    {
      operation: 'replace',
      path: ['a'],
      value: 2
    }
  ])
  t.end()
})
