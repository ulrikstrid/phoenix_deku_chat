import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import watchify from 'watchify';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';

var watch = false;

gulp.task('js', function () {
	bundle();
});

gulp.task('watch-js', function () {
	watch = true;
	bundle();
});

function bundle() {

	let brows;
	let customOpts = {
		entries: ['./web/static/js/app.js'],
		debug: true
	};

	if (watch) {
		let opts = Object.assign({}, watchify.args, customOpts);
		brows = watchify(browserify(opts));
	} else {
		customOpts.debug = false;
		brows = browserify(customOpts);
	}

	brows
		.on('update', bundle)
		.on('log', gutil.log)
		.transform(babelify.configure({
			stage: 0
		}));

	function rebundle(bundler) {
		return bundler.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(gulpif(!watch,
				uglify()
			))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./priv/static/js'));
	}

	return rebundle(brows);
}