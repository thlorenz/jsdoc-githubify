'use strict';

var cheerio = require('cheerio');

var go = module.exports = function (html) {
  var dom = cheerio('<__wrap__>' + html + '</__wrap__>');
  dom.find('pre.prettyprint')
    .each(function (idx, x) {
      var pre = cheerio(x);
      var code = pre.find('code');

      if (!code) return;

      var src = code.html();
      pre.replaceWith([
          ''
        , '```js'
        , src
        , '```'
        , ''
        ].join('\n')
      );
    })
  return dom.html();
};

// Test
if (!module.parent && typeof window === 'undefined') {
  var html = [
  '   <h5>Example</h5>'
 , '   <pre class="prettyprint"><code>// contrived example to test code highlighting'
 , 'var assert = require(\'assert\')'
 , '  , add = require(\'add\');'
 , ''
 , 'var c = add(1, 2);'
 , 'assert.equal(c, 1 + 2);</code></pre>'
 , '    </dd>'
 , '  </dl>'
 ].join('\n');

 var res = go(html);
 console.log(res);
  
}
