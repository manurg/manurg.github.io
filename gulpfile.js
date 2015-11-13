'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var open = require('gulp-open');


// ----


var DIST_DIR = 'dist';
var libs = [
  'lib/fastclick/lib/fastclick.js',
  'lib/lodash/lodash.js',
  'lib/mobile-detect/mobile-detect.js',
  'lib/jquery/dist/jquery.js'
];


// main tasks
gulp.task('default', ['scripts', 'scripts:libs', 'openUrl', 'watch']);
gulp.task('deploy', ['scripts:libs', 'scripts:deploy', 'sass:deploy']);


// sub tasks
gulp.task('watch', function () {
  gulp.watch('src/*.js', ['scripts']);
  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('openUrl', function () {
  return gulp.src('')
    .pipe(open({uri: 'http://localhost:4000'}));
});


// styles
gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('sass:deploy', function () {
  gulp.src('sass/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(DIST_DIR));
});


// scripts
gulp.task('scripts', function () {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('scripts:libs', function () {
  return gulp.src(libs)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('scripts:deploy', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR));
});
