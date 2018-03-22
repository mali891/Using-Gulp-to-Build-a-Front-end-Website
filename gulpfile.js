'use strict';

const gulp = require('gulp'),
      dest = require('gulp-dest'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      maps = require('gulp-sourcemaps'),
      scss = require('gulp-sass'),
      csso = require('gulp-csso'),
      imagemin = require('gulp-imagemin'),
      clean = require('gulp-clean'),
      connect = require('gulp-connect'),
      watch = require('gulp-watch'),
      livereload = require('gulp-livereload'),
      fs = require('fs');

const options = {
    js: ['js/**.js', 'js/**/**.js'],
    scss: [
        'sass/**.scss',
        'sass/**/**.sass',
        'sass/**/**/**.sass'
    ]
};

gulp.task('concatScripts', () => {
    return gulp.src([options.js[1], options.js[0]])
        .pipe(maps.init())
        .pipe(concat('all.concat.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts', ['concatScripts'], () => {
    return gulp.src(['dist/scripts/all.concat.js'])
        .pipe(maps.init())
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/scripts'))
});

gulp.task('compileScss', () => {
    return gulp.src([
        options.scss[2],
        options.scss[1],
        options.scss[0]
    ])
        .pipe(maps.init())
        .pipe(scss())
        .pipe(rename('all.concat.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload({ start: true }))
});

gulp.task('styles', ['compileScss'], () => {
    return gulp.src(['dist/styles/all.concat.css'])
            .pipe(maps.init())
            .pipe(csso())
            .pipe(rename('all.min.css'))
            .pipe(maps.write('./'))
            .pipe(gulp.dest('dist/styles'))
            .pipe(connect.reload());
});

gulp.task('images', () => {
    return gulp.src(['images/**.jpg', 'images/**.jpeg', 'images/**.png'])
            .pipe(imagemin({
                verbose:true
            }))
            .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', () => {
    if(fs.existsSync('dist')) {
        return gulp.src(['dist'])
                .pipe(clean())
    } else {
        return;
    }
});

gulp.task('server', () => {
    return connect.server({
        livereload:true
    });
});

gulp.task('watch', () => {
    return gulp.watch([
        options.scss[1],
        options.scss[0]
    ], ['styles'])
});

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], () => {
    console.log('Build task complete.');
})

gulp.task('default', ['build', 'server', 'watch'], () => {
    console.log('Default task complete');
})
