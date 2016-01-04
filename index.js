'use strict';
var path = require('path');
var fs = require('fs');
var objectAssign = require('object-assign');
var pify = require('pify');
var Promise = require('pinkie-promise');
var gm = require('gm');
var mkdir = require('mkdirp');
var platforms = require('./platforms.json');
var mkdirp = pify(mkdir, Promise);
var fsP = pify(fs, Promise);

function calculateDimension(imgSize, screenSize, opts, resizeFn) {
	var width;
	var height;

	if (imgSize.width > imgSize.height) {
		width = screenSize.width * opts.contentRatio;
		height = imgSize.height / imgSize.width * width;
	} else {
		height = screenSize.height * opts.contentRatio;
		width = imgSize.width / imgSize.height * height;
	}

	if (resizeFn === 'density') {
		// calculate the dpi (= 72 * targetSize / srcSize)
		width = 72 * width / imgSize.width;
		height = 72 * height / imgSize.height;
	}

	return {width: width, height: height};
}

function draw9Patch(file, screen, dimension) {
	var dest = path.join(path.dirname(file), path.basename(file, '.png') + '.9.png');

	var widthRatio = screen.width * 0.05;
	var heightRatio = screen.height * 0.05;

	var left = (screen.width - dimension.width) / 2 - widthRatio;
	var right = screen.width - left;
	var top = (screen.height - dimension.height) / 2 - heightRatio;
	var bottom = screen.height - top;

	var img = gm(file)
		.gravity('Center')
		.background('transparent')
		.extent(screen.width + 2, screen.height + 2)
		.fill('black')
		.drawLine(1, 0, left, 0)
		.drawLine(screen.width, 0, right, 0)
		.drawLine(0, 1, 0, top)
		.drawLine(0, screen.height, 0, bottom);

	return pify(img.write.bind(img), Promise)(dest).then(function () {
		return fsP.unlink(file);
	});
}

module.exports = function (file, opts) {
	if (typeof file !== 'string') {
		return Promise.reject(new TypeError('Expected a file.'));
	}

	opts = objectAssign({
		platform: '',
		dest: process.cwd(),
		orientation: 'both',
		background: 'white',
		contentRatio: 0.8,
		draw9patch: true
	}, opts);

	if (opts.platform === '') {
		return Promise.reject(new Error('Please provide a platform'));
	} else if (Object.keys(platforms).indexOf(opts.platform.toLowerCase()) === -1) {
		return Promise.reject(new Error('Platform ' + opts.platform + ' is not supported.'));
	}

	var platform = platforms[opts.platform.toLowerCase()];
	var resizeFn = path.extname(file) === '.svg' ? 'density' : 'resize';

	var screens = opts.orientation === 'both' ? [].concat(platform.landscape || [], platform.portrait || [], platform.square || []) : [].concat(platform[opts.orientation] || [], platform.square || []);

	var img = gm(file);

	return pify(img.identify.bind(img), Promise)()
		.then(function (identity) {
			var size = identity.size;

			return Promise.all(screens.map(function (screen) {
				var dest = path.join(opts.dest, screen.name);
				var dimension = calculateDimension(size, screen, opts, resizeFn);

				var image = gm(file)[resizeFn](dimension.width, dimension.height)
					.gravity('Center')
					.background(opts.background)
					.extent(screen.width, screen.height);

				return mkdirp(path.dirname(dest))
					.then(function () {
						return pify(image.write.bind(image), Promise)(dest);
					})
					.then(function () {
						if (opts.platform === 'android' && opts.draw9patch) {
							return draw9Patch(dest, screen, dimension);
						}
					})
					.then(function () {
						return dest;
					});
			}));
		});
};
