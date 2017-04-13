# Template for Static Websites
A template for a static website using [Sass](http://sass-lang.com/) and
[Gulp](gulpjs.com). Intended to be deployed to [S3](https://aws.amazon.com/s3/)
static website hosting but should also be compatible with any Apache style server.

## Initial Setup
- Clone this repository and change the origin to your new repository
- Install [NPM](https://www.npmjs.com/)
- Install the dependencies: `npm install` (You will need to have ruby and gem installed)

## Usage
- Run `gulp serve` to develop locally
- Run `gulp build` to build for production
- After building, upload the `dist` folder to your server
