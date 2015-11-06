var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('default', ['compress', 'watch']);

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['compress']);
});

gulp.task('compress', function() {
  return gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
