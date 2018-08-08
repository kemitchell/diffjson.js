var tape = require('tape')
var diffjson = require('../')

tape('push to array', function (t) {
  var result = diffjson(
    ['a', 'b'],
    ['a', 'b', 'c']
  )
  t.deepEqual(result, [
    {op: 'add', path: [2], value: 'c'}
  ])
  t.end()
})

tape('pop from array', function (t) {
  var result = diffjson(
    ['a', 'b', 'c'],
    ['a', 'b']
  )
  t.deepEqual(result, [
    {op: 'remove', path: [2]}
  ])
  t.end()
})
