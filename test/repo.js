var repo = require('../lib/repoClass.js')
  , should = require('should')
  , path = require('path')
  , assert = require('assert')
  ;

describe('repo', function() {
  var validRelativePath = './test/TestGitRepo'
    , invalidRelativePath = './test'
    , validAbsolutePath = path.resolve(validRelativePath)
    , invalidAbsolutePath = path.resolve(invalidRelativePath)
    , arrayOfBranch = [ { develop: '28595e80e9fd7319a379153ed3cd9169d79deace' }
                      , { master: '5c95ba4bd7969740f402a07b4e06bbf351124d65' } ]
    ;

  describe('testing init with non-git repo', function() {
    describe("relative path", function() {
      it("should throw an exception", function() {
        var absolutePath = path.resolve(invalidRelativePath);
        
        (function() {
          repo.init(invalidRelativePath)
        }).should.throw(invalidAbsolutePath + " is not a valid git repo.");    
      })
    })

    describe("absolute path", function() {
      it("should throw an excetption", function (){
        (function() {
          repo.init(invalidAbsolutePath);
        }).should.throw(invalidAbsolutePath + " is not a valid git repo.")
      })
    })
  })

  describe('testing init with existing git repo', function() {
    var myrepo = repo.init(validRelativePath);

    it("should return git dir", function() {
      var repoDir = myrepo.getDir();
      repoDir.should.be.a('string');
      repoDir.should.be.equal(path.join(validRelativePath,'.git'));
    })

    it("should return an array of heads", function(done) {
      myrepo.getBranches(function (err, branches) {
        branches.should.be.an.instanceof(Array);
        branches.should.be.eql(arrayOfBranch)
        done();
      })
    })

    it("should return the head name", function (done) {
      myrepo.getHead(function (err, name) {
        name.should.be.a('string');
        name.should.be.equal('develop');
        done();
      })
    })

    it("should return core config", function (done) {
      myrepo.getConfigSection('core', function (err, config) {
        config.should.be.a('string');
        config.should.be.equal("\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n")
        done();
      })
    })

    it("should return non-existing section error", function (done) {
      var sectionName = 'pippo'
      myrepo.getConfigSection(sectionName, function (err, config) {
        err.should.be.a('object');
        err.message.should.be.equal('No match for section: '+sectionName);
        done();
      })
    })
  })
})