var GoogleSpreadsheet = require('google-spreadsheet'),
    parser = require('xml2js'),
    fs = require('fs'),
    when = require('when'),
    colorspaces = require('colorspaces');


function processRow(sheet, rowId, result) {
  var deferred = when.defer();

  sheet.getCells({
    'min-row': rowId,
    'max-row': rowId,
    'return-empty': true
  }, function(err, cells){
    if(err){
      deferred.reject(err);
      return;
    } else {
      var color = colorspaces.make_color('hex',cells[22].value);
      var c = {
        name : cells[0].value,
        code : cells[1].value,
        special : cells[19].value,
        type : cells[20].value,
        hex : "#" + color.as('hex'),
        lab : color.as('CIELAB'),
        enabled : true
      };
      result.push(c);
      console.log(rowId + " : " + JSON.stringify(c));
      deferred.resolve(result);
    }
  });
  return deferred.promise;

}

var doc = new GoogleSpreadsheet('1f988o68HDvk335xXllJD16vxLBuRcmm3vg6U9lVaYpA'),
    sheet;

doc.getInfo(function(err, info) {
  if(err){
    console.log("Error : ", err);
  }
  else {
    sheet = info.worksheets[0];

    var pChain = when([]);
    for(var i = 3; i < 248; ++i) {
      pChain = pChain.then(function(sheet, rowId, result){
        return processRow(sheet, rowId, result);
      }.bind(null,sheet,i));
    };
    pChain.then(function(result){
      var s = JSON.stringify(result);
      fs.writeFileSync('palette.json',s);
    }).catch(function(err){
      console.log("Error : " + err);
    })


  };
});
