"use strict";


const path = {
    tasks: './gulp/tasks/'
};
const gulp     = require('gulp'),
      pug2html = require(path.tasks + 'pug2html'),
      styles   = require(path.tasks + 'styles');


// TASKS

exports.build = gulp.parallel(pug2html, styles);




//
//
//
//
// // VARS
//
// // fast path for src, build, watch, clean tasks
// let path = {
//     build: {
//         html:  'assets/build/',
//         js:    'assets/build/js/',
//         css:   'assets/build/css/',
//         img:   'assets/build/img/',
//         fonts: 'assets/build/fonts/'
//     },
//     src: {
//         html:  'assets/src/*.html',
//         js:    'assets/src/dev_js/main.js',
//         style: 'assets/src/sass/main.scss',
//         img:   'assets/src/img/**/*.*',
//         fonts: 'assets/src/fonts/**/*.*'
//     },
//     watch: {
//         html:  'assets/src/**/*.html',
//         js:    'assets/src/dev_js/**/*.js',
//         css:   'assets/src/sass/**/*.scss',
//         img:   'assets/src/img/**/*.*',
//         fonts: 'assets/srs/fonts/**/*.*'
//     },
//     clean:     './assets/build/*'
// };
//
// // browser-sync server settings
// let config = {
//     server: {
//         baseDir: './assets/src'
//     },
//     port: 8089,
// 		open: true,
// 		notify: false
// };
//
//
//
// // REQUIRE PLUGINS
//
// // Add packages
// const { src, dest, series, parallel, watch } = require('gulp');
// const webserver         = require('browser-sync'), // reload browser in real time
//       plumber           = require('gulp-plumber'), // for errors
//       rigger            = require('gulp-rigger'), // import info from files to other files
//       sourcemaps        = require('gulp-sourcemaps'), // sourcemaps for css and js
//       sass              = require('gulp-sass'), // SCSS to CSS
//       autoprefixer      = require('gulp-autoprefixer'),
//       cleanCSS          = require('gulp-clean-css'), // minimize CSS
//       uglify            = require('gulp-uglify'), // minimize JS
//       cache             = require('gulp-cache'), // for cache imgs
//       imagemin          = require('gulp-imagemin'), // for minimaze PNG, JPEG, GIF and SVG
//       jpegrecompress    = require('imagemin-jpeg-recompress'), // for minimaze jpeg
//       pngquant          = require('imagemin-pngquant'), // for minimaze png
//       del               = require('del'), // remove files and folders
//       stripCssComments  = require('gulp-strip-css-comments'), // remove comments
//       pug2html          = require('./gulp/tasks/pug2html');
//
//
//
// // FUNCTIONS
//
// // clean
//
// //-------------------------------
// /*function cleanFolder(path, cb){
// 	del.sync(path);
// 	cb();
// };*/
// //-------------------------------
// function cleanBuildFolder(cb){
// 	del.sync(path.clean);
// 	cb();
// }
//
// function createWebserver(cb){
// 	webserver(config);
// 	cb();
// }
//
// // ?????????????????????????????????????????????????????????
// //
// // !!!!
// // I REMOVE MINIMIZE .JS AND SOURSEMAP FROM DEV PROCESS, BECAUSE COMPILATION TIME IS LONG.
// // NOW FILE MINIMIZE AT BUILD COMMAND.
// // !!!!
//
// // ?????????????????????????????????????????????????????????
// //
// // TRUE NAMING FOR ALL "--BUILD" FUNCTIONS, FOR EXAMPLE "htmlBuild" IS NOT BUILD AT THIS MOMENT,
// // IT`S JUST RELOAD BROWSER. AND OTHER FUNCTIONS...
//
//
//
// function htmlBuild(){
// 	return src(path.src.html)
// 		     //.pipe(plumber())
//          //.pipe(rigger())
//          //.pipe(dest(path.src.html))
//          .pipe(webserver.reload({stream: true}));
// }
//
// // ?????????????????????????????????????????????????????????
// //
// // THIS FUNCTION IS DUBLIKATE BELOW FOR BUILD TASK...
// function cssBuild(){
// 	return src(path.src.style)
// 		     .pipe(plumber())
//          .pipe(sass())
//          .pipe(autoprefixer({
//             overrideBrowserslist: ['last 2 versions'],
//             cascade: false
//          }))
//          .pipe(stripCssComments({preserve: false}))
//          .pipe(cleanCSS())
//          .pipe(dest('assets/src/css'))
//          .pipe(webserver.reload({stream: true}));
// }
//
// function jsBuild(){
// 	return src(path.src.js)
// 		     .pipe(plumber())
//          .pipe(rigger())
//          .pipe(dest('assets/src/js'))
//          .pipe(webserver.reload({stream: true}));
// }
//
// // ?????????????????????????????????????????????????????????
// //
// // BROWSER DON`T RELOAD ON CHANGES IN THIS FOLDER, WHEN ADD OR REMOVE FILES...
// function fontsBuild(){
//   return src(path.src.fonts)
//          .pipe(webserver.reload({stream: true}));
// }
//
// function imageBuild(){
//   return src(path.src.img)
// 		      .pipe(cache(imagemin([ // compressing img
// 		        imagemin.gifsicle({interlaced: true}),
//             jpegrecompress({
//               progressive: true,
//               max: 90,
//               min: 80
//             }),
//             pngquant(),
//             imagemin.svgo({plugins: [{removeViewBox: false}]})
// 		      ])))
//         .pipe(dest(path.build.img));
// }
//
//
// // ?????????????????????????????????????????????????????????
// //
// // THIS IS DUBLIKATE PROBLEM WITH "function fontsBuild()"
// // BROWSER DON`T RELOAD ON CHANGES IN FONTS FOLDER, WHEN ADD OR REMOVE FILES...
// function watchChanges(cb){
//   watch(path.watch.html, htmlBuild);
//   watch(path.watch.css, cssBuild);
//   watch(path.watch.js, jsBuild);
// 	cb();
// }
//
//
// //
// // BUILD FUNCTIONS
// //
//
// function moveFiles(from, to){
//   return src(from)
//          .pipe(dest(to));
// }
//
// function moveFilesList(cb){
//   moveFiles(path.src.html, path.build.html);
//   moveFiles(path.src.fonts, path.build.fonts);
//   cb();
// }
//
// // MINIMIZE FILES FOR BUILD TASK
// function minimizeCSS(){
//   return src(path.src.style)
// 		     .pipe(plumber())
//          .pipe(sass())
//          .pipe(autoprefixer({
//             overrideBrowserslist: ['last 2 versions'],
//             cascade: false
//          }))
//          .pipe(stripCssComments({preserve: false}))
//          .pipe(cleanCSS())
//          .pipe(dest('assets/build/css'));
// }
//
// function minimizeJS(){
//   return src('assets/src/dev_js/main.js')
//          .pipe(plumber())
//          .pipe(rigger())
//          //.pipe(sourcemaps.init())
//          .pipe(uglify())
//          //.pipe(sourcemaps.write('./'))
//          .pipe(dest('assets/build/js'))
// }
//
//
//
// // TASKS
//
// // watch changes
// exports.watch = series(
//   createWebserver,
//   watchChanges
// );
//
// // build project to build folder
// exports.build = series(
//   //cleanBuildFolder,
//   parallel(
//     // minimizeCSS,
//     // minimizeJS,
//     // imageBuild,
//     // moveFilesList,
//     pug2html
//   )
// );