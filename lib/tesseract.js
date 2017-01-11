'use strict';

/**
 * Module dependencies.
 */
var utils = require('./utils');
var exec = require('child_process').exec;
var fs = require('fs');
var tmpdir = require('os').tmpdir(); // let the os take care of removing zombie tmp files
var uuid = require('uuid');
var path = require('path');
var glob = require("glob");

var Tesseract = {

  tmpFiles: [],

  /**
   * options default options passed to Tesseract binary
   * @type {Object}
   */
  options: {
    'l': 'eng',
    'psm': 3,
    'config': null,
    'binary': 'tesseract'
  },

  /**
   * outputEncoding
   * @type {String}
   */
  outputEncoding: 'UTF-8',

  /**
   * Runs Tesseract binary with options
   *
   * @param {String} image
   * @param {Object} options to pass to Tesseract binary
   * @param {Function} callback
   */
  process: function(image, options, callback) {

    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    var defaultOptions = utils.merge({}, Tesseract.options);
    options = utils.merge(defaultOptions, options);

    // generate output file name
    var output = path.resolve(tmpdir, 'node-tesseract-' + uuid.v4());

    // add the tmp file to the list
    Tesseract.tmpFiles.push(output);

    // assemble tesseract command
    var command = [options.binary, image, output];
    if (options.psm == 0) {
      command = [options.binary, image, 'stdout'];
    }

    if (options.l !== null) {
      command.push('-l ' + options.l);
    }

    if (options.psm !== null) {
      command.push('-psm ' + options.psm);
    }

    if (options.config !== null) {
      command.push(options.config);
    }

    command = command.join(' ');

    var opts = options.env || {};

    // Run the tesseract command
    var childProcess = exec(command, opts, function(err) {
      if (err) {
        // Something went wrong executing the assembled command
        callback(err, null);
        return;
      }

      // Find one of the three possible extension
      glob(output + '.+(html|hocr|txt)', function(err, files){
        if (err) {
          callback(err, null);
          return;
        }
        fs.readFile(files[0], Tesseract.outputEncoding, function(err, data) {
          if (err) {
            callback(err, null);
            return;
          }

          var index = Tesseract.tmpFiles.indexOf(output);
          if (~index) Tesseract.tmpFiles.splice(index, 1);

          fs.unlinkSync(files[0]);

          if (options.psm == 0) {
            data = parseOsdOutput(data);
          }
          callback(null, data)
        });
      })
    }); // end exec

    if (options.psm == 0) {
      childProcess.stderr.pipe(fs.createWriteStream(output + '.txt'));
    }

  }

};

function parseOsdOutput(string) {
  return string
    .split('\n')
    .reduce(function(obj, line) {
      var result;

      result = /Orientation in degrees: (\d+)/.exec(line);
      if (result) {
        obj.orientation = parseInt(result[1]);
        return obj;
      }

      result = /Orientation confidence: (\d+(\.\d+))/.exec(line);
      if (result) {
        obj.orientationConfidence = parseFloat(result[1]);
        return obj;
      }

      result = /Script confidence: (\d+(\.\d+))/.exec(line);
      if (result) {
        obj.scriptConfidence = parseFloat(result[1]);
        return obj;
      }

      return obj;
    }, {});
}

function gc() {
  for (var i = Tesseract.tmpFiles.length - 1; i >= 0; i--) {
    try {
      fs.unlinkSync(Tesseract.tmpFiles[i] + '.txt');
    } catch (err) {}

    var index = Tesseract.tmpFiles.indexOf(Tesseract.tmpFiles[i]);
    if (~index) Tesseract.tmpFiles.splice(index, 1);
  };
}

var version = process.versions.node.split('.').map(function(value) {
  return parseInt(value, 10);
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown(err) {
    gc();
    throw err;
  });
}

// clean up the tmp files
process.addListener('exit', function _exit(code) {
  gc();
});

/**
 * Module exports.
 */
module.exports.process = Tesseract.process;
