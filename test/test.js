import path from 'path';
import test from 'ava';
import tempfile from 'tempfile';
import m from '..';
import {exists, notExists, isLandscape, isPortrait, isSquare, size} from './fixtures/utils';

test.beforeEach(t => {
	t.context.tmp = tempfile();
});

test('android', async t => {
	const landscape = [
		'drawable-ldpi-land/splash.png',
		'drawable-mdpi-land/splash.png',
		'drawable-hdpi-land/splash.png',
		'drawable-xhdpi-land/splash.png',
		'drawable-xxhdpi-land/splash.png',
		'drawable-xxxhdpi-land/splash.png'
	];

	const portrait = [
		'drawable-ldpi-port/splash.png',
		'drawable-mdpi-port/splash.png',
		'drawable-hdpi-port/splash.png',
		'drawable-xhdpi-port/splash.png',
		'drawable-xxhdpi-port/splash.png',
		'drawable-xxxhdpi-port/splash.png'
	];

	await m('test/fixtures/icon.png', {platform: 'android', dest: t.context.tmp, draw9patch: false});

	exists(t, [].concat(landscape, portrait));
	await isLandscape(t, landscape);
	await isPortrait(t, portrait);
});

test('ios', async t => {
	const landscape = [
		'Default-Landscape-736h.png',
		'Default-Landscape~ipad.png',
		'Default-Landscape@2x~ipad.png',
		'Default-Landscape@~ipadpro.png'
	];

	const portrait = [
		'Default-667h.png',
		'Default-736h.png',
		'Default-568h@2x~iphone.png',
		'Default~iphone.png',
		'Default@2x~iphone.png',
		'Default-Portrait~ipad.png',
		'Default-Portrait@2x~ipad.png',
		'Default-Portrait@~ipadpro.png'
	];

	const square = [
		'Default@2x~universal~anyany.png'
	];

	await m('test/fixtures/icon.png', {platform: 'ios', dest: t.context.tmp});

	exists(t, [].concat(landscape, portrait));
	await isLandscape(t, landscape);
	await isPortrait(t, portrait);
	await isSquare(t, square);
});

test('bb10', async t => {
	const landscape = [
		'splash-1280x720.png',
		'splash-1280x768.png'
	];

	const portrait = [
		'splash-720x1280.png',
		'splash-768x1280.png'
	];

	const square = [
		'splash-720x720.png',
		'splash-1440x1440.png'
	];

	await m('test/fixtures/icon.png', {platform: 'blackberry10', dest: t.context.tmp});

	exists(t, [].concat(landscape, portrait, square));
	await isLandscape(t, landscape);
	await isPortrait(t, portrait);
	await isSquare(t, square);
});

test('portrait', async t => {
	await m('test/fixtures/icon.png', {platform: 'blackberry10', dest: t.context.tmp, orientation: 'portrait'});

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
	await m('test/fixtures/icon.svg', {platform: 'android', dest: t.context.tmp, orientation: 'portrait'});

	exists(t, 'drawable-ldpi-port/splash.9.png');
	notExists(t, 'drawable-ldpi-port/splash.png');

	const {width, height} = await size(path.join(t.context.tmp, 'drawable-ldpi-port/splash.9.png'));
	t.is(width, 202);
	t.is(height, 322);
});

test('no 9patch', async t => {
	await m('test/fixtures/icon.svg', {platform: 'android', dest: t.context.tmp, orientation: 'portrait', draw9patch: false});

	notExists(t, 'drawable-ldpi-port/splash.9.png');
	exists(t, 'drawable-ldpi-port/splash.png');

	const {width, height} = await size(path.join(t.context.tmp, 'drawable-ldpi-port/splash.png'));
	t.is(width, 200);
	t.is(height, 320);
});
