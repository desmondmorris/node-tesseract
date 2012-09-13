# Tesseract for node.js

A simple wrapper for the Tesseract OCR package for node.js

## Installation
npm install nodecr

## Versions
* **0.0.4**: Changed name to nodecr and published node module (formerly node-tesseract)
* **0.0.3**: Added support for custom preprocessors, OTB Preprocessor using ImageMagick 'convert'
* **0.0.2**: Refactored to support tesseract 3.01, added language parameter, config parameter, documentation
* **0.0.1**: Initial version from Desmond Morris

## Usage

```JavaScript
var nodecr = require('nodecr');

// Recognise text of any language in any format
nodecr.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});

// Recognise German text in a single uniform block of text
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