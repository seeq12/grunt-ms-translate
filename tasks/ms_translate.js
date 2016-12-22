/*
 * grunt-ms-translate
 * Translates strings using the microsoft translation API
 *
 * Copyright (c) 2016 Jason Rust
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const variableDictionary = {};
// See https://msdn.microsoft.com/en-us/library/ff512403.aspx
const MAX_TRANSLATE_ELEMENTS = 10;

function deepTraverseJson(json, cb) {
  _.forOwn(json, function(value, key) {
    if (_.isObject(value)) {
      deepTraverseJson(value, cb);
      return;
    }

    cb(json, value, key);
  });
}

function findVariables(str, regex) {
  const match = str.match(regex);
  return _.isNull(match) ? [] : match;
}

function addToVariableDictionary(originalString) {
  // Matches nested variables, up to 2 levels deep, e.g. "Error: {hasError, select, true{: {message}} other{}}."
  // See http://stackoverflow.com/a/35271017/1108708
  const variableRegex = /({(?:[^}{]+|{(?:[^}{]+|{[^}{]*})*})*})/ig;
  const variables = findVariables(originalString, variableRegex);
  let currentString = originalString;

  variables.forEach(function(variable) {
    const destinationVar = 'GRUNT_MS_TRANSLATE_VAR_' + Object.keys(variableDictionary).length;
    variableDictionary[destinationVar] = variable;
    currentString = currentString.replace(variable, destinationVar);
  });

  return currentString;
}

function createVariableSafeJson(origJson) {
  const sourceJson = _.cloneDeep(origJson);

  deepTraverseJson(sourceJson, function(parent, value, key) {
    const varSafeString = addToVariableDictionary(value);
    parent[key] = varSafeString;
  });

  return sourceJson;
}

function revertVariablesInJson(translatedJson) {
  const replacedRegex = /(GRUNT_MS_TRANSLATE_VAR_\d+)/g;
  const sourceJson = _.cloneDeep(translatedJson);

  deepTraverseJson(sourceJson, function(parent, value, key) {
    const variables = findVariables(value, replacedRegex);

    variables.forEach(function(variable) {
      parent[key] = parent[key].replace(variable, variableDictionary[variable]);
    });
  });

  return sourceJson;
}

function translate(origJson, translateArray, source, target, destPath, grunt) {
  const jsonReferenceArray = [];
  const sourceJson = _.cloneDeep(origJson);

  deepTraverseJson(sourceJson, function(parent, value, key) {
    jsonReferenceArray.push({
      parent: parent,
      value: value,
      key: key
    });
  });

  grunt.log.writeln('Translating into: ' + target);
  return _.chain(jsonReferenceArray)
    .map('value')
    .chunk(MAX_TRANSLATE_ELEMENTS)
    .map((translateChunk) => translateArray({ texts: translateChunk, from: source, to: target }))
    .thru(Promise.all)
    .value()
    .then((translatedChunks) => {
      const translations = _.flatten(translatedChunks);
      _.forEach(jsonReferenceArray, (jsonReference, i) => {
        // parent is a reference to the JSON, so changing it updates sourceJson
        jsonReferenceArray[i].parent[jsonReferenceArray[i].key] = translations[i].TranslatedText;
      });

      return { dest: destPath, json: sourceJson };
    });
}

module.exports = function(grunt) {
  grunt.registerMultiTask('ms_translate',
    'A build task to translate JSON files to other languages using Microsoft\'s Translation API. Pairs very well with angular-translate.',
    function() {
      const done = this.async();
      const MsTranslator = require('mstranslator');
      const msTranslate = new MsTranslator({ api_key: this.options().msApiKey }, true);
      const translateArray = Promise.promisify(msTranslate.translateArray, { context: msTranslate });

      _.chain(this.files)
        .map(function(file) {
          file.prefix = file.prefix || '';
          file.suffix = file.suffix || /.+(\..+)/.exec(file.src)[1];

          const languageJson = JSON.parse(grunt.file.read(file.src));
          const variableSafeJson = createVariableSafeJson(languageJson);

          return _.map(file.targetLanguages, function(targetLanguage) {
            const filePath = file.dest + file.prefix + targetLanguage + file.suffix;
            return translate(variableSafeJson, translateArray, file.sourceLanguage, targetLanguage, filePath, grunt);
          });
        })
        .flatten()
        .thru(Promise.all)
        .value()
        .then((translatedJsons) => {
          grunt.log.writeln('Writing translated file');
          _.forEach(translatedJsons, function(translatedJson) {
            const revertedJson = revertVariablesInJson(translatedJson.json);
            grunt.file.write(translatedJson.dest, JSON.stringify(revertedJson, null, 2) + '\n');
            grunt.log.writeln('Wrote translated file: ' + translatedJson.dest);
          });

          done();
        })
        .catch(grunt.fail.fatal);
    });
};
