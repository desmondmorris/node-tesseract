'use strict';

var tesseract = require('../lib/tesseract');
var should = require('should');


describe('process', function(){
  it('should return the string "node-tesseract"', function(done){

    var testImage = __dirname + '/test.png';

    tesseract.process(testImage, function(err, text) {
      text.trim().should.equal('node-tesseract');
      done();
    });

  });

  it('should return the string "node-tesseract" when run with options', function(done){

  var testImage = __dirname + '/test.png';

  tesseract.process(testImage, {
    psm:3,
    l:'eng'
  }, function(err, text) {
    text.trim().should.equal('node-tesseract');
    done();
  });

  })
})

