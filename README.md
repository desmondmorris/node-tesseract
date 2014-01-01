# Tesseract for node.js

[![NPM](https://nodei.co/npm/node-tesseract.png)](https://nodei.co/npm/node-tesseract/)

A simple wrapper for the Tesseract OCR package for node.js

## Requirements

* Tesseract 3.01 or higher is needed for this to work

## Installation
npm install node-tesseract

## Changelog
* **0.1.1**: Updates tmp module.
* **0.1.0**: Removes preprocessing functionatlity.  See #3.
* **0.0.3**: Adds basic test coverage for process method
* **0.0.2**: Pulls in changes by [joscha](https://github.com/joscha) including: refactored to support tesseract 3.01, added language parameter, config parameter, documentation, Added support for custom preprocessors, OTB Preprocessor using ImageMagick 'convert'
* **0.0.1**: Initial version

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

// Recognize German text in a single uniform block of text

var options = {
	l: 'deu',
	psm: 6
};

tesseract.process(__dirname + '/path/to/image.jpg', options, function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});
```
