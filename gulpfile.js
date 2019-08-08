"use strict";




/* ___________________________________________________
______________________________________________________
_______________________ VARS _________________________
___________________________________________________ */

// fast path for src, build, watch, clean tasks
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
        style: 'assets/src/sass/main.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html:  'assets/src/**/*.html',
        js:    'assets/src/js/**/*.js',
        css:   'assets/src/sass/**/*.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean:     './assets/build/*'
};

// browser-sync server settings
var config = {
    server: {
        baseDir: './assets/src'
    },
    port: 8089,
		open: true,
		notify: false
};




/* ___________________________________________________
______________________________________________________
__________________ REQUIRE PLUGINS ___________________
___________________________________________________ */

// Add packages
const { src, dest, series, parallel, watch } = require('gulp');
const webserver         = require('browser-sync'), // reload browser in real time
      plumber           = require('gulp-plumber'), // for errors
      rigger            = require('gulp-rigger'), // import info from files to other files
      sourcemaps        = require('gulp-sourcemaps'), // sourcemaps for css and js
      sass              = require('gulp-sass'), // SCSS to CSS
      autoprefixer      = require('gulp-autoprefixer'),
      cleanCSS          = require('gulp-clean-css'), // minimize CSS
      uglify            = require('gulp-uglify'), // minimize JS
      cache             = require('gulp-cache'), // for cache imgs
      imagemin          = require('gulp-imagemin'), // for minimaze PNG, JPEG, GIF and SVG
      jpegrecompress    = require('imagemin-jpeg-recompress'), // for minimaze jpeg	
      pngquant          = require('imagemin-pngquant'), // for minimaze png
      del               = require('del'), // remove files and folders
      stripCssComments  = require('gulp-strip-css-comments'), // remove comments
      rename            = require('gulp-rename'); // rename file before dest




/* ___________________________________________________
______________________________________________________
_______________________ TASKS ________________________
___________________________________________________ */

// FIRST STEP - clean build folder

function cleanBuildFolder(cb){
	del.sync(path.clean);
	cb();
};


// NEXT STEP - write some functions for build some files.

// This is build functions for all type of web dev files: html, styles(css, scss), code(js), imgs.
// This functions group(calls) into one additional function - "runAllBuildFunctions"

function htmlBuild(){
	return src(path.src.html)
		     .pipe(plumber())
         .pipe(rigger())
         .pipe(dest(path.build.html))
         .pipe(webserver.reload({stream: true}));
};

function cssBuild(){
	return src(path.src.style)
		     .pipe(plumber())
         //.pipe(sourcemaps.init())
         .pipe(sass())
         .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
         }))
         .pipe(cleanCSS())
         //.pipe(sourcemaps.write('./'))
         .pipe(stripCssComments({preserve: false}))
         .pipe(dest('assets/src/css'))
         .pipe(webserver.reload({stream: true}));
};

function jsBuild(){
	return src(path.src.js)
		     .pipe(plumber())
         .pipe(rigger())
         //.pipe(sourcemaps.init())
         .pipe(uglify())
         //.pipe(sourcemaps.write('./'))
         .pipe(rename('main.min.js'))
         .pipe(dest('assets/src/js'))
         .pipe(webserver.reload({stream: true}));
};

function fontsBuild(){
	return src(path.src.fonts)
		     .pipe(dest(path.build.fonts));
};

function imageBuild(){
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
};

// NEXT STEP

function createWebserver(cb){
	webserver(config);
	cb();
};

// NEXT STEP

function watchChanges(cb){
  watch(path.watch.html, htmlBuild);
  watch(path.watch.css, cssBuild);
  watch(path.watch.js, jsBuild);
  watch(path.watch.img, imageBuild);
  watch(path.watch.fonts, fontsBuild);
	cb();
};

function takeFile(from, to){
  return src(from)
         .pipe(dest(to));
};

function moveFile(cb){
  takeFile(path.src.html, path.build.html);
  takeFile('assets/src/css/main.css', path.build.css);
  takeFile('assets/src/js/main.min.js', path.build.js);
  takeFile(path.src.img, path.build.img);
  takeFile(path.src.fonts, path.build.fonts);
  cb();
}




/* ___________________________________________________
______________________________________________________
__________________ TASKS FOR CONSOLE _________________
___________________________________________________ */

// build files and watch changes
exports.watch = series(
  parallel(
    htmlBuild,
	  cssBuild,
	  jsBuild,
	  fontsBuild,
	  imageBuild
  ),
  createWebserver,
  watchChanges
);


// build project to build folder
exports.build = series(
  cleanBuildFolder,
  moveFile
);