const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
// const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');


const clean = () => {
    return del(['dist']);
};

const styles = () => {
    return src('src/styles/components/**/*.css')
        .pipe(concat('styles/main.css'))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCss({ level: 2 }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

const favicon = () => {
    return src('src/image/favicon.{ico,png,svg}')
      .pipe(dest('dist/image'));
  };

const stylesNorm = () => {
    return src('src/vendor/**/*.css')
        .pipe(concat('styles/normalize.css'))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCss({ level: 2 }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

const htmlMinify = () => {
    return src('src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('app.js'))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

const images = () => {
    return src([
        'src/image/**/*.jpg',
        'src/image/**/*.png',
        'src/image/**/*.svg',
        'src/image/**/*.jpeg',
    ], { encoding: false })
        .pipe(image())
        .pipe(dest('dist/image'))
};

const fonts = () => {
    return src('src/fonts/**/*.woff2') 
        .pipe(dest('dist/fonts')); 
};
 
const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    watch('src/**/*.html', htmlMinify);
    watch('src/styles/**/*.css', styles);
    watch('src/styles/**/*.css', stylesNorm);
    // watch('src/image/svg/**/*.svg', svgSprites);
    watch('src/js/**/*.js', scripts);
    watch('src/image/favicon.*', favicon);
    watch('src/fonts/**/*.woff2', fonts);
};

exports.clean = clean;
exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.images = images;
exports.stylesNorm = stylesNorm;
exports.favicon = favicon;
exports.fonts = fonts;

exports.default = series(clean, fonts, favicon, htmlMinify, scripts, styles, stylesNorm, images, watchFiles);

