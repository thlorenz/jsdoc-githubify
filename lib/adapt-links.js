'use strict';

var resolveBranch =  require('resolve-git-branch')
  , resolveRemote =  require('resolve-git-remote')
  , asyncreduce   =  require('asyncreduce')
  , cheerio       =  require('cheerio')

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

var go = module.exports = function (html, cb) {
  githubInfo(function (err, ghinfo) {
    if (err) return cb(err);

    var x = cheerio(html)

    x.find('.tag-source li')
      .map(function (idx, x) {
          if (x.children && x.children[0] && x.children[0].data) {
            var parts = x.children[0].data.split(',');
            if (parts.length < 2) return null;
            return { li: cheerio(x), file: parts[0].trim(), lineno: parts[1].replace(/line/, '').trim() };
          }
      })
      .filter(function (x) { return x })
      .forEach(function (x) {
        var fileUrl = ghinfo.blobRoot + x.file;
        x.li.replaceWith(
          '\n<li>\n' +
            '<a href="' + fileUrl + '">' + x.file + '</a>\n' +
            '<span>, </span>\n' +
            '<a href="' + fileUrl + '#L' + x.lineno + '">lineno ' + x.line + '</a>\n' +
          '</li>\n'
        )
      })

      var trimmedHtml = x.html().trim();
      cb(null, trimmedHtml);
    });
};

// Test

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
  , '<dl class="details">'
  , '    <dt class="tag-source">Source:</dt>'
  , '    <dd class="tag-source"><ul class="dummy"><li>'
  , '        index.js, line 30'
  , '    </li></ul></dd>'
  , '</dl>'
  , '    </div>'
  , ' </article>'].join('\n');

  go(html, function (err, res) {
    if (err) return console.error(err);
    console.log(res);
  });
}
