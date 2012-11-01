var repo = require('../lib/repo.js')
  , should = require('should')
  , path = require('path')
  , assert = require('assert')
  ;

describe('repo', function() {
  var validRelativePath = './test/testRepo'
    , invalidRelativePath = './test'
    , validAbsolutePath = path.resolve(validRelativePath)
    , invalidAbsolutePath = path.resolve(invalidRelativePath)
    , arrayOfBranch = [ { develop: 'e42d12f3d9f9c47bdd79a0bb837cfdf50d4a58af' }
                      , { master: 'e42d12f3d9f9c47bdd79a0bb837cfdf50d4a58af' } ]
    , blob = "303ff981c488b812b6215f7db7920dedb3b59d9a"
    , tree = "324e16519b70c18a9c92db30aa800912ec7f41be"
    , commit = "e42d12f3d9f9c47bdd79a0bb837cfdf50d4a58af"
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

    it("should return a blob", function (done) {
      myrepo.getObject(blob, function (err, result) {
        result.should.be.eql({ type: 'blob', body: 'first file\n' })
        done();
      })
    })

    it("should return a tree", function (done) {
      myrepo.getObject(tree, function (err, result) {
        result.should.be.eql({  type: 'tree', 
                                body:  [{ mode: '40000',
                                          name: 'directory',
                                          sha: '9478b1d051193adbcb55bc970d536f86f6b33ee7',
                                          type: 'tree' },
                                        { mode: '100644',
                                          name: 'file1.txt',
                                          sha: '303ff981c488b812b6215f7db7920dedb3b59d9a',
                                          type: 'blob' },
                                        { mode: '100755',
                                          name: 'file2.txt',
                                          sha: '973ac8d835d1408f00738967744f22289d34e9d3',
                                          type: 'blob' }] 
                            });
        done();
      })
    })
    
    it("should return a commit", function (done) {
      myrepo.getObject(commit, function (err, result) {
        result.should.be.eql({  type: 'commit',
                                body: { info: { tree: '324e16519b70c18a9c92db30aa800912ec7f41be',
                                                parent: '944305b83ae20c4fd5683d54a7ae4e231ffc2b0e',
                                                author: 'Luca <lucaling@gmail.com> 1330355408 +0100',
                                                committer: 'Luca <lucaling@gmail.com> 1330355408 +0100' },
                                        message: 'added +x to file2.txt\n' } 
                              });
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