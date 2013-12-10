'use strict';

var stream = require('stream');
var util = require('util');
var adaptHtml = require('./lib/adapt-html');

var Transform = stream.Transform || require('readable-stream').Transform;

module.exports = function (file /* not used */) {
  return new GitifyTransform();
}

util.inherits(GitifyTransform, Transform);

function GitifyTransform (opts) {
  if (!(this instanceof GitifyTransform)) return new GitifyTransform(opts);

  opts = opts || {};
  
  Transform.call(this, opts);
  this.original = '';
}

GitifyTransform.prototype._transform = function (chunk, encoding, cb) {
  this.original += encoding === 'utf8' ? chunk : chunk.toString();
  cb();
};

GitifyTransform.prototype._flush = function (cb) {
  var self = this;

  // if the document contains no API doc we filter it by transforming to empty string
  if (!adaptHtml.hasApi(self.original)) return cb();

  adaptHtml(self.original, function (err, html) {
    if (err) return cb(err);
    var lines = html.split('\n');
    
    // trim lines and remove empties
    var trimmedhtml = lines
      .map(function (x) { return x.trim() })
      .filter(function (x) { return x.length })
      .join('\n');

    self.push(trimmedhtml);
    cb();
  });
};
