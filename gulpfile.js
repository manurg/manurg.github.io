'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var open = require('gulp-open');

gulp.task('default', ['compress', 'openUrl', 'watch']);

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['compress']);
});

gulp.task('openUrl', function () {
  return gulp.src('')
    .pipe(open({uri: 'http://localhost:4000'}));
});

gulp.task('compress', function () {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
