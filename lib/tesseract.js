var exec = require('child_process').exec;
    fs = require('fs');
    crypto = require('crypto');

var tesseract = {
  process: function process( image, callback ) {
    var date = new Date().getTime();
    var output = crypto.createHash('md5').update( image + date ).digest("hex") + '.tif';
    exec("convert " + image + " -type Grayscale " + output, function(err, stdout, stderr){
      //if(err) throw err;
      exec("tesseract " + output + " " + output + " -psm 047", function(err, stdout, stderr){
        if(err) throw err;    
        fs.readFile(output + '.txt', function(err,data){
          if(err) throw err;
          text = data.toString('ascii').replace(/\W/g, '');
          fs.unlink(output + '.txt', function (err) {
            if (err) throw err;
            fs.unlink(output, function (err) {
              if (err) throw err;
            });
          });
          callback(err, text);
        });
      });
    });
  }
}

module.exports.process = tesseract.process;