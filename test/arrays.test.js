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

tape('push array into array', function (t) {
  var result = diffjson(
    ['a', 'b'],
    ['a', 'b', []]
  )
  t.deepEqual(result, [
    {op: 'add', path: [2], value: []}
  ])
  t.end()
})

tape.only('splice array into array', function (t) {
  var result = diffjson(
    ['a', 'b'],
    ['a', [], 'b']
  )
  t.deepEqual(result, [
    {op: 'add', path: [1], value: []}
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

tape('splice from array', function (t) {
  var result = diffjson(
    ['a', 'b', 'c'],
    ['a', 'c']
  )
  t.deepEqual(result, [
    {op: 'remove', path: [1]}
  ])
  t.end()
})

tape('splice from another array', function (t) {
  var result = diffjson(
    ['a', 'b', 'c', 'd', 'e', 'f'],
    ['a', 'b', 'c', 'e']
  )
  t.deepEqual(result, [
    {op: 'remove', path: [3]},
    {op: 'remove', path: [5]}
  ])
  t.end()
})
