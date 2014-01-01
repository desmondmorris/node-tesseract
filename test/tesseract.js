'use strict';

var tesseract = require('../lib/tesseract');
var assert = require('assert');


describe('process', function(){
  it('should return the string "node-tesseract"', function(done){

    var testImage = __dirname + '/test.png';

    tesseract.process(testImage, function(err, text) {
      assert.equal(text, 'node-tesseract');
      done();
    });

  })
})

