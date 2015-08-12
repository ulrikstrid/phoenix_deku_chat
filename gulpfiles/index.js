import gulp from 'gulp';

import styles from './styles.js';
import scripts from './scripts.js';

gulp.task('default', ['js', 'css'], function () {});

gulp.task('watch', ['css', 'watch-js'], function () {
	gulp.watch(['web/static/**/*.css'], ['css']);
});