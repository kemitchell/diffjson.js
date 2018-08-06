var diff = require('crgmw-diff')
var jsonolt = require('jsonolt')

module.exports = function (a, b) {
  var aTree = jsonolt.encode(a)
  var bTree = jsonolt.encode(b)
  var result = diff(aTree, bTree)
  return result.editScript
}
