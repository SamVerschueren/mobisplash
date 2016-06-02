'use strict';
var path = require('path');
var pathExists = require('path-exists');
var gm = require('gm');
var pify = require('pify');
var Promise = require('pinkie-promise');

var size = function (filePath) {
	var image = gm(filePath);
	return pify(image.size.bind(image), Promise)();
};

exports.exists = function (t, files) {
	return [].concat(files).forEach(function (file) {
		return t.true(pathExists.sync(path.join(t.context.tmp, file)));
	});
};

exports.notExists = function (t, files) {
	return [].concat(files).forEach(function (file) {
		return t.false(pathExists.sync(path.join(t.context.tmp, file)));
	});
};

exports.isPortrait = function (t, files) {
	var promises = files.map(function (file) {
		return size(path.join(t.context.tmp, file));
	});

	return Promise.all(promises)
		.then(function (sizes) {
			sizes.forEach(function (size) {
				t.true(size.height > size.width);
			});
		});
};

exports.isLandscape = function (t, files) {
	var promises = files.map(function (file) {
		return size(path.join(t.context.tmp, file));
	});

	return Promise.all(promises)
		.then(function (sizes) {
			sizes.forEach(function (size) {
				t.true(size.width > size.height);
			});
		});
};

exports.isSquare = function (t, files) {
	var promises = files.map(function (file) {
		return size(path.join(t.context.tmp, file));
	});

	return Promise.all(promises)
		.then(function (sizes) {
			sizes.forEach(function (size) {
				t.true(size.height === size.width);
			});
		});
};

exports.size = size;
