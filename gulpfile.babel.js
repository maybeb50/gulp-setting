const { series, parallel, src, dest, watch } = require('gulp');

/* Gulp Plugin */
const scss = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    minifyJS = require('gulp-minify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync');

function clean(cb) {
    cb();
}

function build(cb) {
    cb();
}

function html(cb) {
    return src('html/*.html')
        .pipe(dest('templates'))
}   

function css(cb) {
    return new Promise( resolve => {
        var scssOptions = {
            outputStyle: 'expanded',
            indentType: 'tab',
            indentWidth: 1,
            precision: 6,
            sourceComments: false
        };
    
        src('public/scss/style.scss', { sourcemaps: true })
            .pipe(scss(scssOptions))
            // .pipe(concat('style.css'))      // 컴파일 된 일반 CSS 
            // .pipe(autoprefixer())
            // .pipe(dest('css/'))
            .pipe(minifyCSS())
            .pipe(concat('style.min.css'))  // 컴파일 된 압축 CSS 
            .pipe(autoprefixer())
            .pipe(dest('static/css/', { sourcemaps: true }))
            .pipe(browserSync.reload({stream:true}))

        resolve();
    });
}

function javascript(cb) {
    return src('public/js/*.js', { sourcemaps: true })
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(minifyJS({
            ext: {
                // src: '-debug.js',
                min: '.js'
            }
        }))
        .pipe(dest('static/js'))
        .pipe(browserSync.reload({stream:true}))
}

function watchs() {
    return new Promise( resolve => {
        watch('html/*.html', html).on('change', browserReload);
        watch('public/scss/*.scss', css).on('change', browserReload);
        watch('public/js/*.js', javascript).on('change', browserReload);
    
        resolve();
    });
}

function browserReload() {
    browserSync.reload();
}

function gulpBrowserSync() {
    return browserSync.init({
        // proxy: 'http://localhost:8005',
        server: {
            baseDir: "./templates"
        },
        port: 8005
    });
}

exports.default = series(css, html, javascript, watchs, gulpBrowserSync);
