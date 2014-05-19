# Tesseract for node.js

[![NPM](https://nodei.co/npm/node-tesseract.png)](https://nodei.co/npm/node-tesseract/)

A simple wrapper for the Tesseract OCR package for node.js

## Requirements

* Tesseract 3.01 or higher is needed for this to work

## Installation
There is a hard dependency on the [Tesseract project](https://code.google.com/p/tesseract-ocr/).  You can find installation instructions for various platforms on the project site. For Homebrew users, the installation is quick and easy.

    brew install tesseract --all-languages

The above will install all of the language packages available, if you don't need them all you can remove the `--all-languages` flag and install them manually, by downloading them to your local machine and then exposing the `TESSDATA_PREFIX` variable into your path:

    export TESSDATA_PREFIX=~/Downloads/

You can then go about installing the node-module to expose the JavaScript API:

    npm install node-tesseract

## Usage

```JavaScript
var tesseract = require('node-tesseract');

// Recognize text of any language in any format
tesseract.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});

// Recognize German text in a single uniform block of text and set the binary path

var options = {
	l: 'deu',
	psm: 6,
	binary: '/usr/local/bin/tesseract'
};

tesseract.process(__dirname + '/path/to/image.jpg', options, function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});
```

## Changelog
* **0.2.6**: Catches exception when deleting tmp files that do not exist
* **0.2.5**: Preserves whitespace and replaces tmp module
* **0.2.4**: Removes console logging for messaging
* **0.2.3**: The ability to set the binary path via the config object.  Better installation documentation.
* **0.2.2**: Adds test converage to utils module
* **0.2.1**: Strips leading & trailing whitespace from output by default
* **0.2.0**: Adds ability to pass options via a configuration object.
* **0.1.1**: Updates tmp module.
* **0.1.0**: Removes preprocessing functionatlity.  See #3.
* **0.0.3**: Adds basic test coverage for process method
* **0.0.2**: Pulls in changes by [joscha](https://github.com/joscha) including: refactored to support tesseract 3.01, added language parameter, config parameter, documentation, Added support for custom preprocessors, OTB Preprocessor using ImageMagick 'convert'
* **0.0.1**: Initial version
