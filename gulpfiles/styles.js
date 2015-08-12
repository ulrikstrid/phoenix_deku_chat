import gulp from 'gulp';
import autoprefixer from 'autoprefixer-core';
import postcss from 'gulp-postcss';
import variables from 'postcss-css-variables';
import csswring from 'csswring';
import mqpacker from 'css-mqpacker';
import mixins from 'postcss-mixins';
import plumber from 'gulp-plumber';
import cssImport from 'postcss-import';
import calc from 'postcss-calc';

gulp.task('css', function () {
	let processors = [
		cssImport,
		autoprefixer({browsers: ['last 2 version']}),
		mixins,
		calc,
		variables,
		mqpacker,
		csswring
	];

	return gulp.src('./web/static/css/app.css')
		.pipe(plumber())
		.pipe(postcss(processors))
		.pipe(gulp.dest('priv/static/css'));
});