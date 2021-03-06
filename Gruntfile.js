/*
 * grunt-ms-translate
 * https://github.com/seeq12/grunt-ms-translate
 *
 * Copyright (c) 2016 Jason Rust
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporterOutput: ''
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    ms_translate: {
      default_options: {
        options: {
          msApiKey: process.env.MS_API_KEY
        },
        files: [{
          src: 'test/fixtures/en.json',
          sourceLanguage: 'en',
          targetLanguages: ['fr', 'ru'],
          dest: 'tmp/'
        }]
      },
      serialized: {
        options: {
          msApiKey: process.env.MS_API_KEY,
          serializeRequests: true
        },
        files: [{
          src: 'test/fixtures/en.json',
          sourceLanguage: 'en',
          targetLanguages: ['de'],
          dest: 'tmp/'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'ms_translate', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
