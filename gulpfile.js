"use strict";


// ____________________________________________________
// _______________________ VARS _______________________
// ____________________________________________________

// for gulp-autoprefixer 
var autoprefixerList = [
  'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];
// path to src, build, files who need whaching and folder who need clean.
var path = {
    build: {
        html:  'assets/build/',
        js:    'assets/build/js/',
        css:   'assets/build/css/',
        img:   'assets/build/img/',
        fonts: 'assets/build/fonts/'
    },
    src: {
        html:  'assets/src/*.html',
        js:    'assets/src/js/main.js',
        style: 'assets/src/style/main.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html:  'assets/src/**/*.html',
        js:    'assets/src/js/**/*.js',
        css:   'assets/src/style/**/*.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean:     './assets/build/*'
};
// browser-sync server settings 
var config = {
    server: {
        baseDir: './assets/build'
    },
    port: 8089,
		open: true,
		notify: false
};


// _______________________________________________________
// _______________________ PLUGINS _______________________
// _______________________________________________________

// Add plugins
const { src, dest, parallel, series, watch } = require('gulp');
const webserver = require('browser-sync'), // reload browser in real time
      plumber = require('gulp-plumber'), // for errors
      rigger = require('gulp-rigger'), // import info from files to other files
      sourcemaps = require('gulp-sourcemaps'), // sourcemaps for css and js
      sass = require('gulp-sass'), // SCSS to CSS
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'), // minimize CSS
      uglify = require('gulp-uglify'), // minimize JS
      cache = require('gulp-cache'), // for cache imgs
      imagemin = require('gulp-imagemin'), // for minimaze PNG, JPEG, GIF and SVG
      jpegrecompress = require('imagemin-jpeg-recompress'), // for minimaze jpeg	
      pngquant = require('imagemin-pngquant'), // for minimaze png
      del = require('del'); // remove files and folders


// _______________________________________________________
// _______________________ TASKS _________________________
// _______________________________________________________

function createWebserver(cb){
	webserver(config);
	cb();
};

function htmlBuild(cb){
	return src(path.src.html)
		     .pipe(plumber())
         .pipe(rigger())
         .pipe(dest(path.build.html))
         .pipe(webserver.reload({stream: true}));
}

function cssBuild(cb){
	return src(path.src.style)
		     .pipe(plumber())
         .pipe(sourcemaps.init())
         .pipe(sass())
         .pipe(autoprefixer({
            browsers: autoprefixerList
         }))
         .pipe(cleanCSS())
         .pipe(sourcemaps.write('./'))
         .pipe(dest(path.build.css))
         .pipe(webserver.reload({stream: true}));
}

function jsBuild(cb){
	return src(path.src.js)
		     .pipe(plumber())
         .pipe(rigger())
         .pipe(sourcemaps.init())
         .pipe(uglify())
         .pipe(sourcemaps.write('./'))
         .pipe(dest(path.build.js))
         .pipe(webserver.reload({stream: true}));
}

function fontsBuild(cb){
	return src(path.src.fonts)
		     .pipe(dest(path.build.fonts));
}

function imageBuild(cb){
	return src(path.src.img)
		      .pipe(cache(imagemin([ // compressing img
		        imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
		      ])))
        .pipe(dest(path.build.img));
}

function cleanBuild(cb){
	del.sync(path.clean);
	cb();
}

function cacheClear(cb){
	cache.clearAll();
	cb();
};

function build(cb){
	htmlBuild(); 
	cssBuild();
	jsBuild();
	fontsBuild(); 
	imageBuild();
	cb();
}

// start tasks on files changes
function watchChanges(cb){
  watch(path.watch.html, htmlBuild);
  watch(path.watch.css, cssBuild);
  watch(path.watch.js, jsBuild);
  watch(path.watch.img, imageBuild);
  watch(path.watch.fonts, fontsBuild);
	cb();
}

// autostart tasks on "gulp" command in console
exports.default = series(
	cleanBuild,
	build,
  createWebserver,
  watchChanges
);