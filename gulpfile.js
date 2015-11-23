'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var del = require('del');


// ----


var DIST_DIR = 'dist';
var libs = [
  'lib/fastclick/lib/fastclick.js',
  'lib/lodash/lodash.js',
  'lib/mobile-detect/mobile-detect.js',
  'lib/jquery/dist/jquery.js'
];


// main tasks
gulp.task('default', function () { runSequence('app:dev', 'libs', 'watch', 'openUrl'); });
gulp.task('deploy', function () { runSequence('libs', 'app:deploy', 'scripts:concat', 'sass:deploy', 'del:dev'); });


// sub tasks
gulp.task('watch', function () {
  gulp.watch('src/*.js', ['scripts']);
  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('openUrl', function () {
  return gulp.src('')
    .pipe(open({uri: 'http://localhost:4000'}));
});


// deletes
gulp.task('del:dev', function () {
  return del([
    DIST_DIR + 'libs.js',
    DIST_DIR + 'app.js'
  ]);
});


// styles
gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('sass:deploy', function () {
  gulp.src('sass/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(DIST_DIR));
});


// scripts
gulp.task('app:dev', function () {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('app:deploy', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('libs', function () {
  return gulp.src(libs)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('scripts:concat', function () {
  return gulp.src([DIST_DIR + '/libs.js', DIST_DIR + '/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(DIST_DIR));
});
