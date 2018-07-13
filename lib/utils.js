'use strict';
const path = require('path');
const fs = require('fs');
const gm = require('gm');
const pify = require('pify');

const fsP = pify(fs);

/**
 * Calculates the dimensions of the content of the icon.
 *
 * @param {number}	imgSize			Size of the source image.
 * @param {number}	screenSize		Size of the destination image.
 * @param {Object}	opts			Options object.
 * @returns {Object} result			Object with px an size object
 */
exports.calculateDimension = (imgSize, screenSize, opts) => {
	let width;
	let height;

	if (imgSize.width > imgSize.height) {
		width = screenSize.width * opts.contentRatio;
		height = imgSize.height / imgSize.width * width;
	} else {
		height = screenSize.height * opts.contentRatio;
		width = imgSize.width / imgSize.height * height;
	}

	// Also calculate the dpi (= 72 * targetSize / srcSize) in case of svg
	return {
		px: {
			width,
			height
		},
		dpi: {
			width: 72 * width / imgSize.width,
			height: 72 * height / imgSize.height
		}
	};
};

/**
 * Draws the nine-patch borders on the source file.
 *
 * @param {string}	file		Source file.
 * @param {Object}	screen		Screen dimension.
 * @param {Object} 	dimension	Content dimension.
 * @returns {Promise} result 	Promise which resolves with images with the nine-patch borders.
 */
exports.draw9Patch = (file, screen, dimension) => {
	// To draw the 9patches, we only need the pixels
	dimension = dimension.px;

	const dest = path.join(path.dirname(file), `${path.basename(file, '.png')}.9.png`);

	const widthRatio = screen.width * 0.05;
	const heightRatio = screen.height * 0.05;

	const left = ((screen.width - dimension.width) / 2) - widthRatio;
	const right = screen.width - left;
	const top = ((screen.height - dimension.height) / 2) - heightRatio;
	const bottom = screen.height - top;

	const img = gm(file)
		.gravity('Center')
		.background('transparent')
		.extent(screen.width + 2, screen.height + 2)
		.fill('black')
		.drawLine(1, 0, left, 0)
		.drawLine(screen.width, 0, right, 0)
		.drawLine(0, 1, 0, top)
		.drawLine(0, screen.height, 0, bottom);

	return pify(img.write.bind(img))(dest).then(() => fsP.unlink(file));
};
