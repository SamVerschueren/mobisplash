'use strict';
const path = require('path');
const pify = require('pify');
const gm = require('gm');
const mkdir = require('mkdirp');
const utils = require('./lib/utils');
const platforms = require('./platforms.json');

const mkdirp = pify(mkdir);

module.exports = (file, opts) => {
	if (typeof file !== 'string') {
		return Promise.reject(new TypeError('Expected a file.'));
	}

	opts = Object.assign({
		platform: '',
		dest: process.cwd(),
		orientation: 'both',
		background: 'white',
		contentRatio: 0.8,
		draw9patch: true
	}, opts);

	if (opts.platform === '') {
		return Promise.reject(new Error('Please provide a platform'));
	}

	if (Object.keys(platforms).indexOf(opts.platform.toLowerCase()) === -1) {
		return Promise.reject(new Error(`Platform ${opts.platform} is not supported.`));
	}

	const platform = platforms[opts.platform.toLowerCase()];
	const resizeFn = path.extname(file) === '.svg' ? 'density' : 'resize';

	const screens = opts.orientation === 'both' ? [].concat(platform.landscape || [], platform.portrait || [], platform.square || []) : [].concat(platform[opts.orientation] || [], platform.square || []);

	const img = gm(file);

	return pify(img.identify.bind(img))()
		.then(identity => {
			const size = identity.size;

			return Promise.all(screens.map(screen => {
				const dest = path.join(opts.dest, screen.name);
				const dimension = utils.calculateDimension(size, screen, opts);

				const resizeDimension = resizeFn === 'density' ? dimension.dpi : dimension.px;

				const image = gm(file)[resizeFn](resizeDimension.width, resizeDimension.height)
					.gravity('Center')
					.background(opts.background)
					.extent(screen.width, screen.height);

				return mkdirp(path.dirname(dest))
					.then(() => pify(image.write.bind(image))(dest))
					.then(() => opts.platform === 'android' && opts.draw9patch && utils.draw9Patch(dest, screen, dimension))
					.then(() => dest);
			}));
		});
};
