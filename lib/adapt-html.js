'use strict';

var resolveBranch =  require('resolve-git-branch')
  , resolveRemote =  require('resolve-git-remote')
  , asyncreduce   =  require('asyncreduce')
  , cheerio       =  require('cheerio')

function overrideWithEnvVars(ghinfo) {
  // could be optimized if both are given since then we don't need to obtain github info
  var env = process.env;
  ghinfo.remote = env.JSDOC_GITHUBIFY_REMOTE || ghinfo.remote;
  ghinfo.branch = env.JSDOC_GITHUBIFY_BRANCH || ghinfo.branch;
}

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
        overrideWithEnvVars(res);
        res.blobRoot = 'https://github.com/' + res.remote + '/blob/' + res.branch;
        cb(null, res);
      }
  );
}

function getDom(html) {

  // all jsdoc pages should have a <div id="main"> and we only care about its children
  var dom = cheerio('<wrap>' + html + '</wrap>')
  var main = dom.find('div#main');
  if (main.length) return main;
  
  // however if that is not found we'll grab the entire body
  var body = dom.find('body');
  if (body.length) return body;

  // and if we don't even have a body we'll take it all
  return dom;
}

function adaptLinks(dom, blobRoot) {
  dom.find('.tag-source li')
    .map(function (idx, x) {
        if (x.children && x.children[0] && x.children[0].data) {
          var parts = x.children[0].data.split(',');
          if (parts.length < 2) return null;
          return { li: cheerio(x), file: parts[0].trim(), lineno: parts[1].replace(/line/, '').trim() };
        }
    })
    .filter(function (x) { return x })
    .forEach(function (x) {
      var fileUrl = blobRoot + '/' + x.file;
      x.li.replaceWith(
        '\n<li>\n' +
          '<a href="' + fileUrl + '">' + x.file + '</a>\n' +
          '<span>, </span>\n' +
          '<a href="' + fileUrl + '#L' + x.lineno + '">lineno ' + x.lineno + '</a>\n' +
        '</li>\n'
      )
    })
}


exports = module.exports = function (html, cb) {
  githubInfo(function (err, ghinfo) {
    if (err) return cb(err);

    var dom = getDom(html); 
    adaptLinks(dom, ghinfo.blobRoot);

    var trimmedHtml = dom.html().trim();
    cb(null, '<div class="jsdoc-githubify">\n' + trimmedHtml + '\n</div>');
  });
};

exports.hasApi = function(html) {
  return !!cheerio(html).find('.details .tag-source').length;
}

// Test

if (!module.parent) {
  var html = [
    '<article>'
  , '  <div class="container-overview">'
  , '  <div class="description"><p>Public wicked API</p></div>'
  , '    <dl class="details">'
  , '        <dt class="tag-source">Source:</dt>'
  , '        <dd class="tag-source"><ul class="dummy"><li>'
  , '            util/helper.js, line 3'
  , '        </li></ul></dd>'
  , '    </dl>'
  , '    <dl class="details">'
  , '        <dt class="tag-source">Source:</dt>'
  , '        <dd class="tag-source"><ul class="dummy"><li>'
  , '            index.js, line 30'
  , '        </li></ul></dd>'
  , '    </dl>'
  , '  </div>'
  , ' </article>'].join('\n');

  var blobRoot = 'blob/root/';

  html = require('fs').readFileSync(__dirname + '/../test/fixtures/wicked-api.html', 'utf8');

  exports(html, function (err, res) {
    if (err) return console.error(err);
    require('fs').writeFileSync(__dirname + '/../test/fixtures/wicked-api.adapted.html', res, 'utf8');
  });

}
