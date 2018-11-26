const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const cache = require('gulp-cache');
const notify = require('gulp-notify');
const del = require('del');

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: '../public'
    },
    notify: false
  });
});

gulp.task('fileinclude', () => {
  return gulp.src(['../src/index.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    })).on('error', notify.onError())
    .pipe(gulp.dest('../public/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', () => {
  return gulp.src('../src/assets/fonts/**/*.*')
    .pipe(gulp.dest('../public/fonts'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', () => {
  return gulp.src('../src/assets/img/**/*.*')
    .pipe(gulp.dest('../public/img'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('sass', () => {
  return gulp.src(['../src/styles/main.sass', '../src/styles/critical.sass'])
    .pipe(sass().on('error', notify.onError()))
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(postcss([require('css-mqpacker')]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('../public/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(['../node_modules/jquery/dist/jquery.js',
    '../node_modules/wowjs/dist/wow.js',
    '../node_modules/slick-carousel/slick/slick.js',
    '../src/js/common.js'
  ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('../public/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('removedist', () =>
  del.sync(['../public'], { force: true })
);

gulp.task('clearcache', () => 
  cache.clearAll()
);

gulp.task('watch', ['removedist', 'sass', 'fileinclude', 'images', 'fonts', 'js', 'browser-sync'], () => {
  gulp.watch('../src/styles/**/*.sass', ['sass']);
  gulp.watch('../src/blocks/**/*.sass', ['sass']);
  gulp.watch('../src/js/common.js', ['js']);
  gulp.watch('../src/blocks/**/*.html', ['fileinclude']);
  gulp.watch('../src/index.html', ['fileinclude']);
  gulp.watch('../src/assets/img/**/*.*', ['images']);
});

gulp.task('default', ['watch']);