
'use strict';

var test = require('tap').test
  , fs = require('fs')
  , applyTransform = require('apply-transform')
  , transform = require('../')


function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

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

test('\nhtml with multiple links with remote but no branch override', function (t) {
  process.env.JSDOC_GITHUBIFY_REMOTE = 'my/remote';

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
          '<a href="https://github.com/my/remote/blob/master/util/helper.js">util/helper.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/my/remote/blob/master/util/helper.js#L3">lineno 3</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/my/remote/blob/master/index.js">index.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/my/remote/blob/master/index.js#L30">lineno 30</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '</div>',
          '</article>',
          '</div>' ]
      , 'overrides blob root url'
    )
    t.end()
  })
})

test('\nhtml with multiple links with remote and branch override', function (t) {
  process.env.JSDOC_GITHUBIFY_REMOTE = 'my/remote';
  process.env.JSDOC_GITHUBIFY_BRANCH = 'my-dev-branch';

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
          '<a href="https://github.com/my/remote/blob/my-dev-branch/util/helper.js">util/helper.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/my/remote/blob/my-dev-branch/util/helper.js#L3">lineno 3</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '<dl class="details">',
          '<dt class="tag-source">Source:</dt>',
          '<dd class="tag-source"><ul class="dummy">',
          '<li>',
          '<a href="https://github.com/my/remote/blob/my-dev-branch/index.js">index.js</a>',
          '<span>, </span>',
          '<a href="https://github.com/my/remote/blob/my-dev-branch/index.js#L30">lineno 30</a>',
          '</li>',
          '</ul></dd>',
          '</dl>',
          '</div>',
          '</article>',
          '</div>' ]
      , 'overrides blob root url'
    )
    t.end()
  })
})
