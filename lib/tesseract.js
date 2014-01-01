/*jslint indent:2 */
'use strict';

var exec = require('child_process').exec;
var fs   = require('fs');
var tmp  = require('tmp');

var tesseract = {

  /**
  *
  * @param image
  *
  * @param callback
  *
  * @param languageCode (Optional) a language code for the language to recognize
  *
  * @param pageSegMode  (Optional) The page segmentation mode.
  *
  *                     0 = Orientation and script detection (OSD) only.
  *                     1 = Automatic page segmentation with OSD.
  *                     2 = Automatic page segmentation, but no OSD, or OCR
  *                     3 = Fully automatic page segmentation, but no OSD. (Default)
  *                     4 = Assume a single column of text of variable sizes.
  *                     5 = Assume a single uniform block of vertically aligned text.
  *                     6 = Assume a single uniform block of text.
  *                     7 = Treat the image as a single text line.
  *                     8 = Treat the image as a single word.
  *                     9 = Treat the image as a single word in a circle.
  *                     10 = Treat the image as a single character.
  *
  * @param config       (Optional) A config file name
  */
  process: function process(image, callback, languageCode, pageSegMode, config, preprocessor) {
    (preprocessor || tesseract.preprocessor)(image, function (err, processedImage, cleanup) {
      if (err) {
        // error in preprocessor
        callback(err, null);
        return;
      }
      tesseract.run(processedImage, function (err, text) {
        if (typeof cleanup === 'function') {
          console.log('node-tesseract: Preprocessor cleanup');
          cleanup();
        }
        callback(err, text);
      }, languageCode, pageSegMode, config);
    });
  },

  run: function (image, callback, languageCode, pageSegMode, config) {
    // generate output file name
    tmp.tmpName(function (err, output) {
      if (err) {
        // Something went wrong when generating the temporary filename
        callback(err, null);
        return;
      }

      // assemble tesseract command
      var command = [tesseract.binary, image, output];

      if (languageCode) {
        command.push('-l');
        command.push(languageCode);
      }
      if (pageSegMode !== undefined && pageSegMode !== null) {
        command.push('-psm');
        command.push(pageSegMode);
      }
      if (config) {
        command.push(config);
      }

      command = command.join(' ');

      // Run the tesseract command
      console.log('node-tesseract: Running \'' + command + '\'');
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
            data = data.toString(tesseract.outputEncoding);
          }
          console.log('node-tesseract: Deleting \'' + outputFile + '\'');
          fs.unlink(outputFile);

          // We got the result (or an error)
          callback(err, data);
        }); // end reaFile

      }); // end exec

    }); // end output filename
  },

  /**
  * A no-op preprocessor
  *
  * @param inputFile  The file to process
  * @param callback   The callback to call when the processing is done
  *                   (1st argument error, 2nd the outputfile
  **/
  preprocessor: function (inputFile, callback) {
    var error = null;
    callback(error, inputFile);
  },

  binary: 'tesseract',
  outputEncoding: 'UTF-8'
};

// OTB preprocessors

var ConvertPreprocessor = function (inputFile, callback) {
  console.log('node-tesseract: preprocessor: convert: Processing \'' + inputFile + '\'');
  tmp.tmpName({postfix: '.tif'}, function (err, outputFile) {
    if (err) {
      // Something went wrong when generating the temporary filename
      callback(err, null);
      return;
    }

    var command = [
      'convert',
      '-type',
      'Grayscale',
      '-resize',
      '200%',
      '-sharpen',
      '10',
      inputFile,
      outputFile
    ].join(' ');

    console.log('node-tesseract: preprocessor: convert: Running \'' + command + '\'');
    exec(command, function (err) {
      if (err) {
        // Something went wrong executing the convert command
        callback(err, null);
      } else {
        var cleanup = function () {
          console.log('node-tesseract: preprocessor: convert: Deleting \'' + outputFile + '\'');
          fs.unlink(outputFile);
        };
        callback(null, outputFile, cleanup);
      }
    }); // end exec
  }); // end output filename generation
};

// Exports

module.exports.process = tesseract.process;
module.exports.preprocessors = {
  convert: ConvertPreprocessor
};
