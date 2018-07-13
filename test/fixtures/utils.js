'use strict';
const path = require('path');
const pathExists = require('path-exists');
const gm = require('gm');
const pify = require('pify');

const size = filePath => {
	const image = gm(filePath);
	return pify(image.size.bind(image))();
};

exports.exists = (t, files) => [].concat(files).forEach(file => t.true(pathExists.sync(path.join(t.context.tmp, file))));
exports.notExists = (t, files) => [].concat(files).forEach(file => t.false(pathExists.sync(path.join(t.context.tmp, file))));

exports.isPortrait = (t, files) => {
	return Promise.all(files.map(file => size(path.join(t.context.tmp, file))))
		.then(sizes => {
			for (const size of sizes) {
				t.true(size.height > size.width);
			}
		});
};

exports.isLandscape = (t, files) => {
	return Promise.all(files.map(file => size(path.join(t.context.tmp, file))))
		.then(sizes => {
			for (const size of sizes) {
				t.true(size.width > size.height);
			}
		});
};

exports.isSquare = (t, files) => {
	return Promise.all(files.map(file => size(path.join(t.context.tmp, file))))
		.then(sizes => {
			for (const size of sizes) {
				t.true(size.width === size.height);
			}
		});
};

exports.size = size;
