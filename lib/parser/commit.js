'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */
var parse = function(data) {
  var arrData, obj, findNextSpace, getInfo, getMessage,
      getData, lineposition;

  arrData = data.toString().split('\n');
  lineposition = arrData.indexOf('')
 
  getInfo = function() {
    var spacePosition
      , arrHeader = arrData.slice(0,lineposition)
      , objHeader = {}
      ;

    arrHeader.forEach(function (x) {
      spacePosition = x.indexOf(' ');
      objHeader[x.slice(0, spacePosition)] = x.slice(spacePosition+1)
    });

    return objHeader;
  };

  getMessage = function() {
    var arrBody = arrData.slice(lineposition+1);
    return arrBody.join('\n');
  };

  getData = function() {
    return {"info": getInfo(), "message": getMessage()};
  };
  
  return getData();
};


module.exports = {parse: parse};

//console.log(new Commit(1).getd());