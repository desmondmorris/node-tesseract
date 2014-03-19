'use strict';

/**
 * Module dependencies.
 */
var utils = require('./utils');
var exec = require('child_process').exec;
var fs   = require('fs');
var tmp  = require('tmp');

var Tesseract = {

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
  process: function (image, options, callback) {

    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    options = utils.merge(Tesseract.options, options);

    // generate output file name
    tmp.tmpName(function (err, output) {
      if (err) {
        // Something went wrong when generating the temporary filename
        callback(err, null);
        return;
      }

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

      // Run the tesseract command
      exec(command, function (err) {
        if (err) {
          // Something went wrong executing the assembled command
          callback(err, null);
          return;
        }

        var outputFile = output + '.txt';
        fs.readFile(outputFile, function (err, data) {
          if (!err) {
            // There was no error, so get the text
            data = data.toString(Tesseract.outputEncoding);
          }
          fs.unlink(outputFile);

          // Trim leading & trailing whitespace from returned text
          // Trimming the data disables support for multi-line documents.  Leave this to the implementor.
          //data = utils.trim(data);

          callback(err, data);
        }); // end reaFile

      }); // end exec

    }); // end output filename
  }

};

/**
 * Module exports.
 */
module.exports.process = Tesseract.process;
