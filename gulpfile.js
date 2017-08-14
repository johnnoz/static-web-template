var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var cleanCSS =  require("gulp-clean-css");
var browserSync  = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var htmlmin = require("gulp-htmlmin");
var del = require('del');
var rename = require('gulp-rename');
var nunjucks = require('gulp-nunjucks-render');
var sitemap = require('gulp-sitemap');
var s3 = require('gulp-s3-upload')({ useIAM: 'true' });

//User Settings
var config = require("./config.json");
var home_page = config.root; //Which page is at root
var page_url = config.url; //Base URL of the site
var qa_s3_bucket = config.qa_s3_bucket; //Bucket for QA deployment
var live_s3_bucket = config.live_s3_bucket; //Bucket for live deployment
var metadata = config.metadata; //File metadata

var styles_path = 'src/**/*.+(scss|sass|css)';
var pages_path = 'src/pages/*.html';
var special_path = 'src/special/*.html';
var partials_path = 'src/partials/';
var assets_path = 'src/assets/**/*';
var js_path = 'src/**/*.js';
var sitemap_path = 'dist/**/*.html';
var output_path = 'dist/**/*';

//Deletes the current dist folder so that it can be rebuilt
gulp.task('clean', function() {
	return del([
		'dist/**/*'
	])
});

//Builds The CSS file
gulp.task('styles', function() {
	return gulp.src(styles_path) //Compile from SASS
		.pipe(concat('style.min.css')) //Concatenate into one file
		.pipe(sass())
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

//Generate the sitemap
gulp.task('sitemap', ['pages'], function() {
	return gulp.src(sitemap_path)
		.pipe(sitemap({
			siteUrl: page_url
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
gulp.task('assets', function() {
	return gulp.src(assets_path)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('deploy-qa', ['build'], function() {
    gulp.src(output_path)
		.pipe(s3({
			Bucket: qa_s3_bucket,
			ACL: 'public-read',
			Metadata: metadata
		}))
});

gulp.task('deploy-live', ['build'], function() {
	gulp.src(output_path)
		.pipe(s3({
			Bucket: live_s3_bucket,
			ACL: 'public-read',
			Metadata: metadata
		}))
});

//Runs the server
gulp.task('browserSync', function() {
	browserSync.init({ server: { baseDir: 'dist' } })
});

//Cleans, runs the scripts and serves from dist
gulp.task('serve', ['clean', 'browserSync', 'styles', 'assets', 'pages', 'sitemap', 'special'], function() {
	gulp.watch(styles_path, ['styles']);
	gulp.watch(pages_path, ['pages', 'sitemap']);
	gulp.watch(partials_path, ['pages']);
    gulp.watch(special_path, ['special']);
	gulp.watch(assets_path, ['assets'])
});

//Builds without serving
gulp.task('build', ['clean', 'styles', 'assets', 'pages', 'sitemap', 'special']);
