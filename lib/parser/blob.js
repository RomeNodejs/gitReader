'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */

var parse = function(data) {
  var getData;

  getData = function() {
    return data.toString();
  };
  
  return getData();
};


module.exports = {parse: parse};

//console.log(new Commit(1).getd());