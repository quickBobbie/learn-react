const gulp = require('gulp');
const stylus = require('gulp-stylus');

gulp.task('stylus', () => {
    return gulp.src('./dev/stylus/*.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest('./public/styles/'));
})

gulp.task('watch', () => {
    return gulp.watch('./dev/stylus/*.styl', ['stylus']);
})

gulp.task('default', ['stylus', 'watch']);