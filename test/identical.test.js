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
