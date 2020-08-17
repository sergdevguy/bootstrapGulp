const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      shorthand    = require('gulp-shorthand'),
      autoprefixer = require('gulp-autoprefixer'),
      clean        = require('gulp-clean-css');

module.exports = function styles() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(shorthand())
        .pipe(autoprefixer())
        .pipe(clean())
        .pipe(gulp.dest('build/css'))
};