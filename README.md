# Tesseract for node.js

[![NPM](https://nodei.co/npm/node-tesseract.png)](https://nodei.co/npm/node-tesseract/) [![wercker status](https://app.wercker.com/status/c0f90816b242c3babc43e516cee94244 "wercker status")](https://app.wercker.com/project/bykey/c0f90816b242c3babc43e516cee94244)

A simple wrapper for the Tesseract OCR package for node.js

## Requirements

* Tesseract 3.01 or higher is needed for this to work

## Installation
npm install node-tesseract

## Versions
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
tesseract.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
}, 'deu', 6);

// Recognize text of any language in any format but preprocess the image
// with ImageMagick 'convert' (This requires ImageMagick to be installed)

// You can write and use your own preprocessors easily, just have a look at lib/tesseract.js
tesseract.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
	console.log(text);
}, null, null, null, tesseract.preprocessors.convert);
```
