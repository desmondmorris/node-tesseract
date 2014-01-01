# Tesseract for node.js

[![NPM](https://nodei.co/npm/node-tesseract.png)](https://nodei.co/npm/node-tesseract/)

A simple wrapper for the Tesseract OCR package for node.js

## Installation
npm install node-tesseract

## Versions
* **0.0.2**: Pulls in changes by [joscha](https://github.com/joscha) including: refactored to support tesseract 3.01, added language parameter, config parameter, documentation, Added support for custom preprocessors, OTB Preprocessor using ImageMagick 'convert'
* **0.0.1**: Initial version

## Usage

```JavaScript
var tesseract = require('node-tesseract');

// Recognize text of any language in any format
nodecr.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});

// Recognize German text in a single uniform block of text
nodecr.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
}, 'deu', 6);

// Recognise text of any language in any format but preprocess the image
// with ImageMagick 'convert' (This requires ImageMagick to be installed)

// You can write and use your own preprocessors easily, just have a look at lib/nodecr.js
nodecr.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
	console.log(text);
}, null, null, null, nodecr.preprocessors.convert);
```
