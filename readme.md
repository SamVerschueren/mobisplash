# mobisplash [![Build Status](https://travis-ci.org/SamVerschueren/mobisplash.svg?branch=master)](https://travis-ci.org/SamVerschueren/mobisplash)

> Mobile app splash screen generator


## Install

```
$ npm install --save mobisplash
```

### GraphicsMagick

This library depends on [GraphicsMagick](http://www.graphicsmagick.org/), so be sure to install this library as well.

#### Mac OSX

```
$ brew install graphicsmagick
```

#### Linux

```
$ sudo apt-get install graphicsmagick
```

#### Windows

[Manual](http://www.graphicsmagick.org/INSTALL-windows.html) installation or via [chocolatey](https://chocolatey.org/).

```
$ choco install graphicsmagick
```


## Usage

```js
const mobisplash = require('mobisplash');

mobisplash('logo.png', {platform: 'ios'}).then(() => {
    // splash screens generated
});

mobisplash('logo.svg', {platform: 'android', draw9patch: false}).then(() => {
    // splash screens generated
});
```


## API

### mobisplash(file, options)

#### file

Type: `string`

Source file of the splash screen.

#### options

##### platform

*Required*  
Type: `string`  
Values: `android` `ios` `blackberry10`

Platform to generate the splash screens for.

##### orientation

Type: `string`  
Values: `both` `portrait` `landscape`  
Default: `both`

Orientation to generate the splash screens for.

##### background

Type: `string`  
Default: `white`

[Color](http://www.graphicsmagick.org/GraphicsMagick.html#details-fill) of the splash screen background.

##### contentRatio

Type: `number`  
Default: `0.8`

Logo-splash screen ratio. `1` means the logo will fill up the entire width (or height) of the splash screen.

##### draw9patch

Type: `boolean`  
Default: `true`

[9-patch](http://developer.android.com/tools/help/draw9patch.html) the `Android` splash screens.

##### dest

Type: `string`  
Default: `process.cwd()`

Directory to save the generated splash screens to.


## Platforms

The supported platforms are `Android`, `iOS` and `BlackBerry 10`. Every platform generates a different set of icons.

### Android

- `drawable-ldpi-land/splash.png`
- `drawable-mdpi-land/splash.png`
- `drawable-hdpi-land/splash.png`
- `drawable-xhdpi-land/splash.png`
- `drawable-xxhdpi-land/splash.png`
- `drawable-xxxhdpi-land/splash.png`
- `drawable-ldpi-port/splash.png`
- `drawable-mdpi-port/splash.png`
- `drawable-hdpi-port/splash.png`
- `drawable-xhdpi-port/splash.png`
- `drawable-xxhdpi-port/splash.png`
- `drawable-xxxhdpi-port/splash.png`

### iOS

- `Default-667h.png`
- `Default-736h.png`
- `Default-Landscape-736h.png`
- `Default-568h@2x~iphone.png`
- `Default~iphone.png`
- `Default@2x~iphone.png`
- `Default-Landscape~ipad.png`
- `Default-Landscape@2x~ipad.png`
- `Default-Portrait~ipad.png`
- `Default-Portrait@2x~ipad.png`

### BlackBerry 10

- `splash-1280x720.png`
- `splash-720x1280.png`
- `splash-1280x768.png`
- `splash-768x1280.png`
- `splash-720x720.png`
- `splash-1440x1440.png`


## Related

- [mobisplash-cli](https://github.com/SamVerschueren/mobisplash-cli) - CLI for this module
- [mobicon](https://github.com/SamVerschueren/mobicon) - Mobile app icon generator


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
