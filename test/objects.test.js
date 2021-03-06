var tape = require('tape')
var diffjson = require('../')

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

tape('string property to other string', function (test) {
  var before = {a: 1, b: 'before'}
  var after = {a: 1, b: 'after'}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: 'after'}
  ])
  test.end()
})

tape('number property to string', function (test) {
  var before = {a: 1, b: 2}
  var after = {a: 1, b: '2'}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: '2'}
  ])
  test.end()
})

tape('null property to string', function (test) {
  var before = {a: 1, b: null}
  var after = {a: 1, b: '2'}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: '2'}
  ])
  test.end()
})

tape('null property to false', function (test) {
  var before = {a: 1, b: null}
  var after = {a: 1, b: false}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: false}
  ])
  test.end()
})

tape('null property to true', function (test) {
  var before = {a: 1, b: null}
  var after = {a: 1, b: true}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'add', path: ['b'], value: true}
  ])
  test.end()
})

tape('delete number property', function (test) {
  var before = {a: 1, b: 2}
  var after = {a: 1}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'remove', path: ['b']}
  ])
  test.end()
})

tape('delete object property', function (test) {
  var before = {a: 1, b: {}}
  var after = {a: 1}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'remove', path: ['b']}
  ])
  test.end()
})

tape('delete nested property', function (test) {
  var before = {a: 1, b: {c: 3}}
  var after = {a: 1}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'remove', path: ['b']}
  ])
  test.end()
})

tape('delete object property', function (test) {
  var before = {a: 1, b: {}}
  var after = {a: 1}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'remove', path: ['b']}
  ])
  test.end()
})

tape('rename object property', function (test) {
  var before = {a: 1}
  var after = {b: 1}
  var diff = diffjson(before, after)
  test.deepEqual(diff, [
    {op: 'move', from: ['a'], path: ['b']}
  ])
  test.end()
})
