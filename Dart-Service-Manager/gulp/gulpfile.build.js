const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const cache = require('gulp-cache');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const purify = require('gulp-purifycss');
const runSequence = require('run-sequence');
const criticalCss = require('critical').stream;
const htmlmin = require('gulp-htmlmin');

const jsFiles = [
  '../node_modules/jquery/dist/jquery.js',
  '../node_modules/wowjs/dist/wow.js',
  '../node_modules/slick-carousel/slick/slick.js',
  '../src/js/common.js',
  '../node_modules//vanilla-lazyload/dist/lazyload.min.js'
];

gulp.task('fileinclude', function() {
  return gulp.src(['../src/index.html', '!node_modules'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    })).on('error', notify.onError())
    .pipe(gulp.dest('../public/'));
});

gulp.task('sass', function() {
  return gulp.src(['../src/styles/main.sass', '!node_modules'])
    .pipe(sass().on('error', notify.onError()))
    .pipe(rename('main.min.css'))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(postcss([require('css-mqpacker')]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('../public/css'));
});

gulp.task('imagemin', function() {
  return gulp.src('../src/assets/img/**/*')
    .pipe(cache(image({
      pngquant: true,
      zopflipng: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true // defaults to false
    })))
    .pipe(gulp.dest('../public/img'));
});

gulp.task('fonts', () => {
  return gulp.src('../src/assets/fonts/**/*.*')
    .pipe(gulp.dest('../public/fonts'));
});

gulp.task('criticalCss', () => {
  return gulp.src('../public/index.html')
    .pipe(criticalCss({base: '../public', extract: true, inline: true, minify: true, css: '../public/css/main.min.css'}))
    .pipe(gulp.dest('../public'));
});

gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(gulp.dest('../public/js'));
});

gulp.task('purify-css', () => {
  return gulp.src('../public/css/*.css')
    .pipe(purify(['../public/js/bundle.js', '../public/index.html']))
    .pipe(gulp.dest('../public/css'));
});

gulp.task('removedist', () =>
  del.sync(['../public'], { force: true })
);

gulp.task('removeCss', () => 
  del.sync(['../public/css/main.min.css'], { force: true })
);

gulp.task('clearcache', function() {
  return cache.clearAll();
});

gulp.task('html-minify', () => {
  return gulp.src('../public/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('../public/'));
});

gulp.task('build', function() {
  runSequence(
    'removedist', 
    'fileinclude',
    ['imagemin', 'sass', 'js', 'fonts'],
    'purify-css',
    'criticalCss',
    'removeCss',
    'html-minify',
  );
});