'use strict';

var tesseract = require('../lib/tesseract');
var should = require('should');
var fs = require('fs');


describe('process', function(){
  it('should return the string "node-tesseract"', function(done){

    var testImage = __dirname + '/test.png';

    tesseract.process(testImage, function(err, text) {
      text.trim().should.equal('node-tesseract');
      done();
    });

  });

  it('should return the string "node-tesseract"', function(done){

    var testImage = __dirname + '/test.png';

    tesseract.processStream(fs.createReadStream(testImage), function(err, text) {
      text.trim().should.equal('node-tesseract');
      done();
    });

  });

});

