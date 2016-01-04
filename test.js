import path from 'path';
import test from 'ava';
import tempfile from 'tempfile';
import pathExists from 'path-exists';
import gm from 'gm';
import pify from 'pify';
import fn from './';

global.Promise = Promise;

function exists(t, files) {
	[].concat(files).forEach(file => t.true(pathExists.sync(path.join(t.context.tmp, file))));
}

function notExists(t, files) {
	[].concat(files).forEach(file => t.false(pathExists.sync(path.join(t.context.tmp, file))));
}

test.beforeEach(t => {
	t.context.tmp = tempfile();
});

test('android', async t => {
	await fn('fixtures/icon.png', {platform: 'android', dest: t.context.tmp, draw9patch: false});

	exists(t, [
		'drawable-ldpi-land/splash.png',
		'drawable-mdpi-land/splash.png',
		'drawable-hdpi-land/splash.png',
		'drawable-xhdpi-land/splash.png',
		'drawable-xxhdpi-land/splash.png',
		'drawable-xxxhdpi-land/splash.png',
		'drawable-ldpi-port/splash.png',
		'drawable-mdpi-port/splash.png',
		'drawable-hdpi-port/splash.png',
		'drawable-xhdpi-port/splash.png',
		'drawable-xxhdpi-port/splash.png',
		'drawable-xxxhdpi-port/splash.png'
	]);
});

test('ios', async t => {
	await fn('fixtures/icon.png', {platform: 'ios', dest: t.context.tmp});

	exists(t, [
		'Default-667h.png',
		'Default-736h.png',
		'Default-Landscape-736h.png',
		'Default-568h@2x~iphone.png',
		'Default~iphone.png',
		'Default@2x~iphone.png',
		'Default-Landscape~ipad.png',
		'Default-Landscape@2x~ipad.png',
		'Default-Portrait~ipad.png',
		'Default-Portrait@2x~ipad.png'
	]);
});

test('bb10', async t => {
	await fn('fixtures/icon.png', {platform: 'blackberry10', dest: t.context.tmp});

	exists(t, [
		'splash-1280x720.png',
		'splash-720x1280.png',
		'splash-1280x768.png',
		'splash-768x1280.png',
		'splash-720x720.png',
		'splash-1440x1440.png'
	]);
});

test('portrait', async t => {
	await fn('fixtures/icon.png', {platform: 'blackberry10', dest: t.context.tmp, orientation: 'portrait'});

	exists(t, [
		'splash-720x1280.png',
		'splash-768x1280.png',
		'splash-720x720.png',
		'splash-1440x1440.png'
	]);

	notExists(t, [
		'splash-1280x720.png',
		'splash-1280x768.png'
	]);
});

test('9patch', async t => {
	await fn('fixtures/icon.svg', {platform: 'android', dest: t.context.tmp, orientation: 'portrait'});

	exists(t, 'drawable-ldpi-port/splash.9.png');
	notExists(t, 'drawable-ldpi-port/splash.png');

	const image = gm(path.join(t.context.tmp, 'drawable-ldpi-port/splash.9.png'));
	const {width, height} = await pify(image.size.bind(image))();

	t.is(width, 202);
	t.is(height, 322);
});

test('no 9patch', async t => {
	await fn('fixtures/icon.svg', {platform: 'android', dest: t.context.tmp, orientation: 'portrait', draw9patch: false});

	notExists(t, 'drawable-ldpi-port/splash.9.png');
	exists(t, 'drawable-ldpi-port/splash.png');

	const image = gm(path.join(t.context.tmp, 'drawable-ldpi-port/splash.png'));
	const {width, height} = await pify(image.size.bind(image))();

	t.is(width, 200);
	t.is(height, 320);
});
