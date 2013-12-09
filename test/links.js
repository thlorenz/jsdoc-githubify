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
 , '    </div>'
 , ' </article>'].join('\n');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nhtml with multiple links without repo or branch override', function (t) {
  applyTransform(transform(), html, function (err, res) {
    if (err) { t.fail(err); return t.end() } 
    inspect(res.split('\n'));
    t.end()
  });
})
