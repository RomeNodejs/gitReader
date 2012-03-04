'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */
var parse = function(data) {
  var arrData, obj, findNextSpace, getInfo, getMessage,
      getData;

  arrData = data.toString().split('\n');

  findNextSpace = function(start) {
    var from = (start === undefined) ? 0 : start;
    
    if (from >= arrData.length) {
      return arrData.length;
    }
    
    while ((arrData[from] !== '') && (from<arrData.length))
    {from += 1;}
    return from;
  };

  
  getInfo = function() {
    var spacePosition
      , arrHeader = arrData.slice(0,findNextSpace(0))
      , objHeader = {}
      ;

    arrHeader.forEach(function (x) {
      spacePosition = x.indexOf(' ');
      objHeader[x.slice(0,spacePosition)] = x.slice(spacePosition+1);
    });

    return objHeader;
  };

  getMessage = function() {
    var arrBody = arrData.slice(findNextSpace(0)+1);
    return arrBody.join('\n');
  };

  getData = function() {
    return {"info": getInfo(), "message": getMessage()};
  };
  
  return getData();
};


module.exports = {parse: parse};

//console.log(new Commit(1).getd());