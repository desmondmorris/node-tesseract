'use strict';

var tesseract = require('../lib/tesseract');
var assert = require('assert');


describe('process', function(){
  it('should return the string "node-tesseract"', function(done){

    var testImage = __dirname + '/test.png';

    tesseract.process(testImage,function(err, text) {

      // Get rid of any extra whitespace
      var trimmed = text
        .replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'')
        .replace(/\s+/g,' ');

      assert.equal(
        trimmed,
        'node-tesseract'
      );
      done();
    });

  })
})

