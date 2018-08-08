var tape = require('tape')
var diffjson = require('../')

tape.skip('one property', function (t) {
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

tape('add object property', function (test) {
  var before = {a: 1}
  var after = {a: 1, b: 2}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: 2}
  ])
  test.end()
})

tape('add object property to empty object', function (test) {
  var before = {}
  var after = {a: 1}
  var diff = diffjson(before, after)
  // The diff algorithm won't match before and after,
  // so the edit script will tell us to replace before.
  test.deepEqual(diff, [
    {op: 'replace', path: [], value: {}},
    {op: 'add', path: ['a'], value: 1}
  ])
  test.end()
})
