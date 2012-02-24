var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , underscore = require('underscore')
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


//TODO: get branches if in packed-refs 
Repo.prototype.getBranches = function (callback) {
  var that = this
    , headsDir = path.join(that.dir,'/refs/heads')
    , heads = {}
    , cb = callback || noop
    , fn
    ;

  fs.readdir(headsDir, function (err, files) {
    if (err) {
      cb(err, null);
    }

    fn = function (filename, cb) {
      fs.readFile(path.join(headsDir, filename), 'utf8', function (err, content) {
        var obj = {};
        if (err) {
          return cb(err, null);
        }    
        obj[filename] = content.slice(0, -1);
        return cb(err, obj);
      });  
    };
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
      return cb(err, null)
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
  })
}

function init(dir) {
  var absolutePath = path.resolve(path.join(dir,".git"))
    , pwd = path.resolve(".")
    ;
  var relativePath=path.relative(pwd, absolutePath);
  if (path.existsSync(relativePath)) {  
    var r = new Repo(relativePath);
    return r;
  } else {
    throw new Error(path.resolve(dir)+" is not a valid git repo.");
  }
};


module.exports.init = init;
