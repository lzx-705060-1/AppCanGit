
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

var child_process = require('child_process');
var spawn = child_process.spawn;
var cmd = require('node-cmd');



//合并js的任务
gulp.task('scripts', function() {

    return gulp.src(['js/lib/q/*.js', 'js/components/**/*.js'])
        //.pipe(concat('sui.debug.js')) //合并后的文件名
        //.pipe(gulp.dest('form/js'))
        //.pipe(rename('sui.js'))
        //.pipe(uglify({mangle:false, compress:true}))
        //.pipe(gulp.dest('form/js'))
        //==================

        .pipe(concat('sui.js')) //合并后的文件名
        .pipe(gulp.dest('js'))
        //==================

        .pipe(rename('sui.min.js'))
        .pipe(uglify())
        .on('error', function(err) {
            console.log('uglify Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});


//合并filter的js
gulp.task('filter', function() {

    return gulp.src('filter/components/**/*.js')
        .pipe(concat('sui-filter.js')) //合并后的文件名
        //.pipe(uglify({mangle:false, compress:true}))
        .pipe(gulp.dest('filter'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .on('error', function(err) {
            console.log('uglify Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest('filter'))
        .pipe(notify({ message: 'filter Scripts task complete' }));
});



//css预处理
gulp.task('css', function() {

    return gulp.src('css/_index.css')
        .pipe(rename({basename: 'index', extname: '.s3css'}))
        .pipe(gulp.dest('css'))
        .pipe(notify({ message: 'css task complete' }));
});



//启动s3script编译的任务

var locked = false;


//监控目标目录或文件发生变化
gulp.task('watch',function(){
    try {
        gulp.watch('js/components/**/*.js',['scripts']);
        gulp.watch('filter/components/**/*.js',['filter']);
        gulp.watch('css/_index.css',['css']);
    } catch(e) {

    }
});

gulp.task('default',['watch'],function(){
    gulp.start('scripts');
    gulp.start('filter');
    gulp.start('css');
});







