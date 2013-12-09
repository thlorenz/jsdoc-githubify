'use strict';

var resolveBranch = require('resolve-git-branch')
  , resolveRemote = require('resolve-git-remote')
  , asyncreduce = require('asyncreduce')

function githubInfo(cb) {
  asyncreduce(
      [ [ 'remote', resolveRemote ], [ 'branch', resolveBranch ] ]
    , {}
    , function (acc, tuple, cb_) {
        tuple[1](function (err, res) {
          if (err) return cb_(err);
          acc[tuple[0]] = res;
          cb_(null, acc);
        });
      }
    , function (err, res) {
        if (err) return cb(err);
        res.blobRoot = 'https://github.com/' + res.remote + '/blob/' + res.branch + '/';
        cb(null, res);
      }
  );
}

var go = module.exports = function (cb) {
  githubInfo(function (err, ghinfo) {
    if (err) return cb(err);

  });
};

// Test

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

if (!module.parent) {
  var html = [
    '<article>'
  , '    <div class="container-overview">'
  , '            <div class="description"><p>Public wicked API</p></div>'
  , '<dl class="details">'
  , '    <dt class="tag-source">Source:</dt>'
  , '    <dd class="tag-source"><ul class="dummy"><li>'
  , '        util/helper.js, line 3'
  , '    </li></ul></dd>'
  , '</dl>'
  , '    </div>'
  , ' </article>'].join('\n');

  githubInfo(function (err, res) {
    if (err) return console.error(err);
    inspect(res)      
  });

}
