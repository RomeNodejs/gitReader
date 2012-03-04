'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */
var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , objFactory = require('./object_factory.js')
  , noop = function () {}
  ;

function Repo (dir) {
  var that = this;
  that.dir = dir;

  return that;
}

Repo.prototype.getDir = function () {
  var that = this;
  return this.dir;
};

Repo.prototype.getObject = function(sha, callback) {
  return objFactory.getObject(sha, this.dir, callback);
};

//TODO: get branches if in packed-refs 
Repo.prototype.getBranches = function (callback) {
  var that = this
    , headsDir = path.join(that.dir,'/refs/heads')
    , heads = {}
    , cb = callback || noop
    , fn
    , files = []
    , stat
    ;

  fs.readdir(headsDir, function (err, content) {
    if (err) {
      cb(err, null);
    }

    fn = function (filename, cb) {
      var file_path = path.join(headsDir, filename);
      fs.readFile(file_path, 'utf8', function (err, content) {
            var obj = {};
            if (err) {
              return cb(err, null);
            }    
            obj[filename] = content.slice(0, -1);
            return cb(null, obj);
      });
    };

    content.forEach(function (filename) {
      stat = fs.statSync(path.join(headsDir, filename));
      if (stat.isFile()) {
        files.push(filename);
      }
    });

    async.map(files, fn, cb);
  });
};

Repo.prototype.getHead = function (callback) {
  var that = this
    , cb = callback || noop
    , confPath = path.join(that.dir,'HEAD')
    ;
  fs.readFile(confPath, 'utf8', function (err, content) {
    var match;
    if (err) {
      return cb(err, null);
    }
    match = /ref: refs\/heads\/(\w+)\n$/.exec(content);
    if (!match) {
      return cb(null, null);
    }
    return cb(null, match[1]);
  });  
};

Repo.prototype.getConfigSection = function (sectionName, callback) {
  var that = this
    , cb = callback || noop
    , confPath = path.join(that.dir, 'config')
    ;
  
  fs.readFile(confPath, 'utf8', function (err, content) {
    var match, config, regex;
    if (err) {
      return cb(err, null);
    }
    regex = new RegExp("\\["+sectionName+"\\]([^\\[]*\\n)+","g");
    match = regex.exec(content);
    if (!match) {
      return cb(new Error('No match for section: '+sectionName), null);
    }
    config = match[1];
    return cb(null, config);
  });
};

function init(dir) {
  var absolutePath = path.resolve(path.join(dir,".git"))
    , pwd = path.resolve(".")
    , relativePath = path.relative(pwd, absolutePath)
    , r
    ;
  if (path.existsSync(relativePath)) {  
    r = new Repo(relativePath);
    return r;
  } else {
    throw new Error(path.resolve(dir)+" is not a valid git repo.");
  }
}


module.exports.init = init;

// var blob = "303ff981c488b812b6215f7db7920dedb3b59d9a"
// var myrepo = init('../test/TestGitRepo');
// myrepo.getObject(blob, function(err, data) {
//   console.log(data);
// })