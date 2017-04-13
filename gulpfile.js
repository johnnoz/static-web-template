var gulp = require("gulp");
var sass = require("gulp-ruby-sass");
var concat = require("gulp-concat");
var cleanCSS =  require("gulp-clean-css");
var browserSync  = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var htmlmin = require("gulp-htmlmin");
var del = require('del');

var styles_path = 'src/**/*.+(scss|sass|css)';
var html_path = 'src/**/*.html';
var static_path = 'src/**/*.+(svg|png|jpg|woff|eot|ttf|xml|txt|json)';

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

//Moves HTML files into dist
gulp.task('html', function() {
	return gulp.src(html_path)
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
gulp.task('serve', ['clean', 'browserSync', 'styles', 'static', 'html'], function() {
	gulp.watch(styles_path, ['styles']);
	gulp.watch(html_path, ['html']);
	gulp.watch(static_path, ['static'])
});

//Builds without serving
gulp.task('build', ['clean', 'styles', 'static', 'html']);
