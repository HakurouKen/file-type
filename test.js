var ft = require('./file-type');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var test_root = './fixture/';

describe("Sync", function() {
	var files = fs.readdirSync(test_root);
	files.forEach(function(file) {
		var ext = path.extname(file).replace('.', '');

		it(file + ' should be ' + ext + ' type', function() {
			assert.equal(ext, ft.getFileTypeSync(test_root + file).ext);
		});
	});
});

describe("Async", function() {
	var files = fs.readdirSync(test_root);
	files.forEach(function(file) {
		var ext = path.extname(file).replace('.', '');

		it(file + ' should be ' + ext + ' type', function(done) {
			ft.getFileType(test_root + file, function(err, fileType) {
				assert.equal(ext, fileType.ext);
				done();
			});

		});
	});
});