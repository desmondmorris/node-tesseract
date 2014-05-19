'use strict';

/**
 * Module dependencies.
 */
var utils = require('./utils');
var exec = require('child_process').exec;
var fs = require('fs');
var tmpdir = require('os').tmpdir(); // let the os take care of removing zombie tmp files
var uuid = require('node-uuid');
var path = require('path');

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

    options = utils.merge(Tesseract.options, options);

    // generate output file name
    var output = path.resolve(tmpdir, 'node-tesseract-' + uuid.v4());

    // add the tmp file to the list
    Tesseract.tmpFiles.push(output);

    // assemble tesseract command
    var command = [options.binary, image, output];

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
    exec(command, opts, function(err) {
      if (err) {
        // Something went wrong executing the assembled command
        callback(err, null);
        return;
      }

      var outputFile = output + '.txt';
      fs.readFile(outputFile, function(err, data) {
        if (!err) {
          // There was no error, so get the text
          data = data.toString(Tesseract.outputEncoding);
        }
        fs.unlink(outputFile);
        // remove the file from the tmpFiles array
        var index = Tesseract.tmpFiles.indexOf(output);
        if (~index) Tesseract.tmpFiles.splice(index, 1);

        callback(err, data);
      }); // end reaFile

    }); // end exec

  }

};

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
