const gulp            = require('gulp'),
      pug             = require('gulp-pug'),
      htmlValidator   = require('gulp-w3c-html-validator');

module.exports = function pug2html() {
    return gulp.src('src/pages/*.pug')
        .pipe(pug({pretty: true})) //- pretty is - don`t minimize html
        .pipe(gulp.dest('build'))
        .pipe(htmlValidator())
};