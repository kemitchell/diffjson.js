var tape = require('tape')
var diffjson = require('../')

tape.only('array substitution', function (test) {
  test.deepEqual(
    diffjson(
      ['a', 'b', 'c'],
      ['a', 'b', 'INSERTED', 'c']
    ),
    [
      {
        operation: 'insert',
        value: 'INSERTED',
        path: [2]
      }
    ]
  )
})
