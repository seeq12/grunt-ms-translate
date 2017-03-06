'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.ms_translate = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options_french: function(test) {
    test.expect(1);

    const actual = grunt.file.read('tmp/fr.json');
    const expected = grunt.file.read('test/expected/fr.json');
    test.equal(actual, expected, 'all 11 english keys should be translated into french, except for variables');

    test.done();
  },
  default_options_russian: function(test) {
    test.expect(1);

    const actual = grunt.file.read('tmp/ru.json');
    const expected = grunt.file.read('test/expected/ru.json');
    test.equal(actual, expected, 'all 11 english keys should be translated into russian, except for variables');

    test.done();
  },
  serialized_german: function(test) {
    test.expect(1);

    const actual = grunt.file.read('tmp/de.json');
    const expected = grunt.file.read('test/expected/de.json');
    test.equal(actual, expected, 'all 11 english keys should be translated into german, except for variables');

    test.done();
  }
};
