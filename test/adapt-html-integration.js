'use strict';

var test = require('tap').test
  , fs = require('fs')
  , applyTransform = require('apply-transform')
  , transform = require('../')


function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nhtml with multiple links without repo or branch override', function (t) {
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

  applyTransform(transform(), html, function (err, res) {
    if (err) { t.fail(err); return t.end() } 

    t.deepEqual(
        res.split('\n')
      , [ '<div class="jsdoc-githubify">',
          '<article>',
          '<div class="container-overview">',
          '<div class="description"><p>Public wicked API</p></div>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/util/helper.js">util/helper.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/util/helper.js#L3">lineno 3</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/index.js">index.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/index.js#L30">lineno 30</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '</div>',
          '</article>',
          '</div>' ]
      , 'links get replaced to point at repo blobs for current branch'
    )
    t.end()
  });
})

test('\nwicked api page with multiple links without repo or branch override', function (t) {
  var html = fs.readFileSync(__dirname + '/fixtures/wicked-api.html', 'utf8')
    , adapted = fs.readFileSync(__dirname + '/fixtures/wicked-api.adapted.full.html', 'utf8')

  applyTransform(transform(), html, function (err, res) {
    if (err) { t.fail(err); return t.end() } 
    t.equal(res, adapted, 'fixes all links, pulls out main div and trims html')
    t.end()
  })
})



test('\ngiven html without any API declaration, i.e. an index page', function (t) {
  var html = [
      '<body>'
    , '  <div id="main">'
    , '    <h1 class="page-title">Index</h1>'
    , '    <h3> </h3>'
    , '  </div>'
    , '</body>'].join('\n')

  applyTransform(transform(), html, function (err, res) {
    if (err) { t.fail(err); return t.end() } 
    t.equal(res, '', 'returns empty string to signal that the document had no API') 
    t.end()
  })
})
