'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */
var parse = function(data) {
  var arrData, obj, findNextChar, getSha, getChunck,
      getData, getMessage, findNextSpace;

  arrData = data.toString().split('\n');

  findNextChar = function(char, start) {
    var from = (start === undefined) ? 0 : start;
    if (from >= data.length) {
      return data.length;
    }
    
    while ((data[from] !== char.charCodeAt(0)) && (from<data.length))
    {from += 1;}
    return from;
  };

  getSha = function(start) {
    return data.slice(start, start+20);
  };

  getChunck = function(start) {
    var from, to;
    from = (start === undefined) ? 0 : start;
    if (from >= data.length) {
      return null;
    }

    to = findNextChar('\0', from);
    return data.slice(from, to);
  };

  getData = function() {
    var arrData, chunck, length, data,
        sha, type;
    
    arrData = [];
    
    length = 0;
    while ( null !== (chunck = getChunck(length))) {
      length += chunck.length+1;
      sha = getSha(length);
      length += sha.length;
      data = chunck.toString().split(' ');
      type = data[0].slice(0, 3) === "100" ? "blob" : "tree";

      arrData.push({mode: data[0], 
                    name:data[1], 
                    sha: sha.toString('hex'), 
                    type: type
                  });
    }
    return arrData;
  };

  getMessage = function() {
    var arrBody = arrData.slice(findNextSpace(0)+1);
    return arrBody.join('\n');
  };
  
  return getData();

};

module.exports = {parse:parse};

//console.log(new Commit(1).getd());