# Tesseract for node.js

A simple wrapper for the Tesseract OCR package for node.js

## Installation
npm install node-tesseract

## Usage

```
var tesseract = require('node-tesseract');

// Recognise text of any language in any format
tesseract.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
});

// Recognise German text in a single uniform block of text
tesseract.process(__dirname + '/path/to/image.jpg',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log(text);
	}
}, 'deu', 6);

// Recognise text of any language in any format but preprocess the image
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