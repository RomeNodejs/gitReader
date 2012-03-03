'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */
var fs = require('fs')
	, path = require('path')
	,	parser = require('./object_parser.js')
	,	zlib = require('zlib')
	;

var noop = function() {};

var objectFactory = function() {
	var that, sha1ToFile, getData, getObject;
	that = {};
	 
	sha1ToFile = function (sha1, dir) {
		return path.join(dir, 'objects', sha1.slice(0, 2), sha1.slice(2, sha1.length));
	};

	getData = function (sha1, dir, cb) {
		var callback, filename;
	 
		if (typeof sha1 === "function") {
			cb = sha1;
			sha1 = undefined;
		}

		if (typeof dir === "function") {
			cb = dir;
			dir = undefined;
		}
		
		callback = cb || noop;
		filename = sha1ToFile(sha1, dir);

		fs.readFile(filename, function (err, data) {
			if (err) {
				return cb(err, null);
			}
			
			zlib.inflate(data, function (err, data) {
				if (err) {
					return cb(err, null);
				}
				cb(null, data);
			});
		});
	};

	getObject = function (sha1, dir, cb) {
		var callback;

		callback = cb || noop;
		
		getData(sha1, dir, function(err, data) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, parser.parse(data));
		});
	};
	
	that.getObject = getObject;
	return that;
};



module.exports = objectFactory();

//var objects = objectFactory()
//	,	blob = "303ff981c488b812b6215f7db7920dedb3b59d9a"
//	, tree = "324e16519b70c18a9c92db30aa800912ec7f41be"
//	,	commit = "e42d12f3d9f9c47bdd79a0bb837cfdf50d4a58af"
//	,	dir= "../../test/TestGitRepo/.git"
//	;

// objects.getData(tree, dir, function(err, data){
//   console.log(data.toString());
// })


// objects.getObject(commit,dir,function(err, data) {
//   console.log(data);
// })

// objects.getObject(tree,dir,function(err, data) {
//   console.log(data);
// })

// objects.getObject(blob,dir,function(err, data) {
//   console.log(data);
// })