# Template for Static Websites
A template for a static website using [Sass](http://sass-lang.com/) and
[Gulp](gulpjs.com). [Nunjucks](https://mozilla.github.io/nunjucks/) performs the page templating.
Intended to be deployed to [S3](https://aws.amazon.com/s3/) static website hosting but should 
also be compatible with any Apache style server.

## Initial Setup
- Clone this repository and change the origin to your new repository
- Install [NPM](https://www.npmjs.com/)
- Install the dependencies: `npm install` (You will need to have ruby and gem installed)
- Edit `config.json` with your details.

## Development
Run `gulp serve` to develop locally. The following directories are relevant to your content:

- `pages` contains pages that will be built.
- `partials` contains templates for frequently used pieces of code.
- `special` contains special pages such as error pages, these pages will be distributed with their
original filenames.
- `assets` contains static files such as favicons and images.

Stylesheets and scripts can be placed wherever is convenient.

The following settings are in `config.json`:

- `home_page`: the main page of the site. This page will be at the root of the website.
- `page_url`: the root url that the page will be deployed to.
- `qa_s3_bucket`: the name of the S3 bucket for QA deployment.
- `live_s3_bucket`: the name of the S3 bucket for live deployment.
- `metadata`: key value pairs for file metadata.

## Deployment
- Run `gulp build` to build for production
- After building, upload the `dist` folder to your server (There are gulp tasks to do this
for S3)
- Alternatively, there is a `buildspec.yml` file which can build your site with
[AWS CodeBuild](https://aws.amazon.com/codebuild/).
