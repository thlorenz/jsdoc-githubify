'use strict';

var stream = require('stream');
var util = require('util');
var adaptLinks = require('./lib/adapt-links');

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

  var lines = this.original.split('\n');
  
  // trim lines and remove empties
  var transformedLines = lines
    .map(function (x) { return x.trim() })
    .filter(function (x) { return x.length })

  adaptLinks(transformedLines.join('\n'), function (err, html) {
    if (err) return cb(err);
    self.push(html);
    cb();
  });
};
