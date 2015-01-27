'use strict';

/**
 * Module dependencies.
 */
var utils = require('./utils');
var spawn = require('child_process').spawn;
var createReadStream = require('fs').createReadStream;

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
   * Create Stream from path, then run processStream
   *
   * @param {String} image
   * @param {Object} options to pass to Tesseract binary
   * @param {Function} callback
   * @returns {Stream}
   */
  process: function(image, options, callback) {
    return this.processStream(createReadStream(image), options, callback);
  },

  

  /**
   * Runs Tesseract binary with options
   *
   * @param {Stream} image
   * @param {Object} options to pass to Tesseract binary
   * @param {Function} callback
   * @returns {Stream}
   */
  processStream: function(image, options, callback) {

    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    options = utils.merge(Tesseract.options, options);

    // assemble tesseract command
    var command = 'stdin stdout';

    if (options.l !== null) {
      command += ' -l ' + options.l;
    }

    if (options.psm !== null) {
      command += ' -psm ' + options.psm;
    }

    if (options.config !== null) {
      command += ' ' + options.config;
    }

    var bin = spawn(Tesseract.options.binary, command.split(' ')),
      body = '', 
      errbody = '',
      done = false;

    image.pipe(bin.stdin);

    if (callback) {
      bin.stdout.on('data', function(chunk) {
        body += chunk;
      });
      bin.stderr.on('data', function(chunk) {
        errbody += chunk;
      });
      bin.on('exit', function() {
          callback(errbody, body);
      });
    }
    return bin.stdout;
  }

};
/**
 * Module exports.
 */
module.exports.process = Tesseract.process;
module.exports.processStream = Tesseract.processStream;
