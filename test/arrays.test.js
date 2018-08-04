var tape = require('tape')
var diffjson = require('../')

tape('add one', function (t) {
  var result = diffjson(
    ['a', 'b'],
    ['a', 'b', 'c']
  )
  t.deepEqual(result, [
    {
      operation: 'insert',
      path: [2],
      value: 'c'
    }
  ])
  t.end()
})

tape('delete one', function (t) {
  var result = diffjson(
    ['a', 'b', 'c'],
    ['a', 'c']
  )
  t.deepEqual(result, [
    {
      operation: 'delete',
      path: [1]
    }
  ])
  t.end()
})
