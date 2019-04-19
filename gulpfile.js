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
      plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
      rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
      sourcemaps = require('gulp-sourcemaps'), // sourcemaps for css and js
      sass = require('gulp-sass'), // SCSS to CSS
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'), // minimize CSS
      uglify = require('gulp-uglify'), // minimize JS
      cache = require('gulp-cache'), // модуль для кэширования
      imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
      jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
      pngquant = require('imagemin-pngquant'), // плагин для сжатия png
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
		     .pipe(plumber()) // отслеживание ошибок
         .pipe(rigger()) // импорт вложений
         .pipe(dest(path.build.html)) // выкладывание готовых файлов
         .pipe(webserver.reload({stream: true})); // перезагрузка сервера
	cb();
}

function cssBuild(cb){
	return src(path.src.style)
		     .pipe(plumber()) // для отслеживания ошибок
         .pipe(sourcemaps.init()) // инициализируем sourcemap
         .pipe(sass()) // scss -> css
         .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList
         }))
         .pipe(cleanCSS()) // минимизируем CSS
         .pipe(sourcemaps.write('./')) // записываем sourcemap
         .pipe(dest(path.build.css)) // выгружаем в build
         .pipe(webserver.reload({stream: true})); // перезагрузим сервер
	cb();
}

function jsBuild(cb){
	return src(path.src.js)
		     .pipe(plumber()) // для отслеживания ошибок
         //.pipe(rigger()) // импортируем все указанные файлы в main.js
         .pipe(sourcemaps.init()) //инициализируем sourcemap
         .pipe(uglify()) // минимизируем js
         .pipe(sourcemaps.write('./')) //  записываем sourcemap
         .pipe(dest(path.build.js)) // положим готовый файл
         .pipe(webserver.reload({stream: true})); // перезагрузим сервер
	cb();
}

// перенос шрифтов
function fontsBuild(cb){
	return src(path.src.fonts)
		     .pipe(dest(path.build.fonts));
	cb();
}

function imageBuild(cb){
	return src(path.src.fonts)
		     .pipe(cache(imagemin([ // сжатие изображений
		    imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
		])))
        .pipe(dest(path.build.img)); // выгрузка готовых файлов
	cb();
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