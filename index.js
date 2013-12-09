'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

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
  var lines = this.original.split('\n');
  var transformedLines = lines
    .filter(function (x) { return x.trim().length })
    .map(function (x) { return x.replace(/^\s+/, '') })

  this.push(transformedLines.join('\n'));
  cb();
};
