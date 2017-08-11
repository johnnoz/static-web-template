var gulp = require("gulp");
var sass = require("gulp-ruby-sass");
var concat = require("gulp-concat");
var cleanCSS =  require("gulp-clean-css");
var browserSync  = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var htmlmin = require("gulp-htmlmin");
var del = require('del');
var rename = require('gulp-rename');
var nunjucks = require('gulp-nunjucks-render');

var home_page = 'home'; //Which page is at root

var styles_path = 'src/**/*.+(scss|sass|css)';
var pages_path = 'src/pages/*.html';
var special_path = 'src/special/*.html';
var partials_path = 'src/partials/';
var static_path = 'src/**/*.+(svg|png|jpg|woff|eot|ttf|xml|txt|json)';
var js_path = 'src/**/*.js';

//Deletes the current dist folder so that it can be rebuilt
gulp.task('clean', function() {
	return del([
		'dist/**/*'
	])
});

//Builds The CSS file
gulp.task('styles', function() {
	return sass(styles_path) //Compile from SASS
		.pipe(concat('style.min.css')) //Concatenate into one file
		.pipe(autoprefixer({  //Add prefixes for any browser with more than 1% market share
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe(cleanCSS({ compatibility: 'ie8' })) //minify
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({ stream: true }))
});

//Compile and minify all js
gulp.task('js', function() {
    return gulp.src(js_path)
        .pipe(concat('main.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({ stream: true }))
});

//Moves HTML files into dist
gulp.task('pages', function() {
	return gulp.src(pages_path)
		.pipe(nunjucks({ path: partials_path }))
		.pipe(htmlmin({ collapseWhitespace: true, minifyJS: true })) //minify
		.pipe(rename(function (path) {
			if (path.basename !== home_page) { //main page goes at root
                path.dirname = path.basename;
			}
			path.basename = 'index';
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

//Move special pages (such as 404)
gulp.task('special', function() {
	return gulp.src(special_path)
		.pipe(nunjucks({ path: partials_path }))
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true })) //minify
		.pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }))
});

//Moves images, fonts, etc. to dist folder
gulp.task('static', function() {
	return gulp.src(static_path)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

//Runs the server
gulp.task('browserSync', function() {
	browserSync.init({ server: { baseDir: 'dist' } })
});

//Cleans, runs the scripts and serves from dist
gulp.task('serve', ['clean', 'browserSync', 'styles', 'static', 'pages', 'special'], function() {
	gulp.watch(styles_path, ['styles']);
	gulp.watch(pages_path, ['pages']);
	gulp.watch(static_path, ['static'])
});

//Builds without serving
gulp.task('build', ['clean', 'styles', 'static', 'pages', 'special']);
