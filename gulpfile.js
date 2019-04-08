const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

function scssToCss(cb) {
  return src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
  	.pipe(sass())
    .pipe(dest('src/css/'))
    .pipe(browserSync.reload({stream:true}));
  cb();
}

// Move the javascript files into our /src/js folder
function moveJs(cb){
	return src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 
							'node_modules/jquery/dist/jquery.min.js', 
							'node_modules/popper.js/dist/umd/popper.min.js'])
		.pipe(dest('src/js/'));
	cb();
}

function syncBrowser(cb){
	browserSync({
		server: {
			baseDir: "./src/"
		},
		port: 8088,
		open: true,
		notify: false
	});

	watch('src/scss/*.scss', scssToCss);
	watch('src/*.html').on('change', browserSync.reload);

	cb();
}

//watch('src/scss/*.scss', scssToCss);

exports.default = series(moveJs, syncBrowser);