'use strict';

var test = require('tap').test
  , applyTransform = require('apply-transform')
  , transform = require('../')

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

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nhtml with multiple links without repo or branch override', function (t) {
  applyTransform(transform(), html, function (err, res) {
    if (err) { t.fail(err); return t.end() } 
    t.deepEqual(
        res.split('\n')
      , [ '<div class="container-overview">',
          '<div class="description"><p>Public wicked API</p></div>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/util/helper.js">util/helper.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/util/helper.js#L3">lineno undefined</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/index.js">index.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/thlorenz/jsdoc-githubify/blob/master/index.js#L30">lineno undefined</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '</div>' ]
      , 'links get replaced to point at repo blobs for current branch'
    )
    t.end()
  });
})
