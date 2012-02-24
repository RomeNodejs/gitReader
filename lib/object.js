var fs = require('fs')
  , path = require('path')
  , objToFile
  , zlib = require('zlib')
  , _ = require('../node_modules/underscore')
  ;


var GitObject = function (sha1, repoDir) {
  var that = this;
  that.sha1 = sha1;
  that.repoDir = dir;
  return that
}

GitObject.prototype.objToFile = function (sha1, dir) {
  var repoDir = this.repoDir || dir;
  var sha1 = this.sha1 || sha1
  return path.join(repoDir, 'objects', sha1.slice(0, 2), sha1.slice(2, sha1.length));
}

GitObject.prototype.gitObjectreadData = function(sha1, dir, cb) {
    if (typeof sha1 === "function") {
      dir = sha1;
      sha1 = undefined;
    }
    if (typeof dir === "function") {
      cb = dir;
      dir = undefined;
    };
    var cb = cb || function() {};
    var sha1 = this.sha1 || sha1;
    var filename = this.objToFile(sha1, dir);
    if (this.data) {
      return cb(null, this.data);
    }
    fs.readFile(filename, function (err, data) {
      if (err) return cb(err, null);
      
      zlib.inflate(data, function (err, data) {
        if (err) {
          return cb(err, null);
        }
        this.data = data;
        cb(null,data);
      });
    });
    return this.data;
  }
}

var initObject = function (sha1, repoDir) {
  var that = this;
  var repoDir = that.repoDir || repoDir;

  var t = new GitObject(sha1, repoDir);
  return t;
}


var obj = initGitObject("4b825dc642cb6eb9a060e54bf8d69288fbee4904", "../test/TestGitRepo/.git");
console.log(obj.objToFile());
obj.readData(function(err, data){
  console.log(data);
})
