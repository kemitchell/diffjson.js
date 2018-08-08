var tape = require('tape')
var diffjson = require('../')

tape('add one', function (t) {
  var result = diffjson(
    ['a', 'b'],
    ['a', 'b', 'c']
  )
  t.deepEqual(result, [
    {op: 'add', path: [2], value: 'c'}
  ])
  t.end()
})

tape('delete one', function (t) {
  var result = diffjson(
    ['a', 'b', 'c'],
    ['a', 'c']
  )
  t.deepEqual(result, [
    {op: 'remove', path: [1]}
  ])
  t.end()
})
