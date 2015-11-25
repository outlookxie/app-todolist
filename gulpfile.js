/**
 * Created by guizhong on 15/8/4.
 */

var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var bs  = require("browser-sync");
var webpack = require("webpack");
var pngquant = require('imagemin-pngquant');


gulp.task('less', function () {
    return gulp.src("src/less/*.less")
        .pipe($.less())
        .pipe($.autoprefixer('last 2 version', 'ios 7', 'android 4'))
        //.pipe($.minifyCss())
        .pipe($.rename(function (path) {
            path.dirname = path.dirname.replace('less','css');
            path.basename = path.basename.replace('.main','');
          }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function () {
    return gulp.src('src/js/**/*')
    //.pipe($.uglify())  //使用uglify进行压缩
        .pipe(gulp.dest('dist/js'));
});


gulp.task('img', function () {
    return gulp.src('src/images/**/*')
        .pipe($.imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
    $.livereload.listen();

    var changed = [];

    gulp.watch("src/**/*.html", ['html', pop]).on('change', push);
    
    gulp.watch('src/**/*.js', ['js',pop]).on('change',push);

    gulp.watch("src/less/*.less", ['less', pop]).on('change', push);


    function push(s) {
        changed.push(s);
    }

    function pop() {
        while (changed.length > 0) {
            var s = changed.pop();
            console.log(s);
            $.livereload.changed(s);
            bs.reload();
        }
    }
});

gulp.task('build', ['less','html','js']);

gulp.task("default",function(){

    bs(
        {
            server: "./dist"
        }
    );
    gulp.start('watch');
});


