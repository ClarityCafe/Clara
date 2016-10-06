const gulp = require('gulp');
const babel = require('gulp-babel');
 
gulp.task('build', () => {
    return gulp.src('src')
        .pipe(babel({
            presets: ['es2015'],
            minified: true,
            comments: false,
            babelrc: true
        }))
        .pipe(gulp.dest('out'));
});
