var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');

gulp.task('default', ['compress', 'watch']);

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['compress']);
});

gulp.task('compress', function() {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
