const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const image = require('gulp-image');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

// Очистка папки dist
const clean = () => del(['dist']);

// Обработка стилей
const styles = () => {
    return src(['src/styles/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('styles/main.css'))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCss({ level: 2 }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

// Normalize.css (отдельно)
const stylesNorm = () => {
    return src('src/vendor/normalize.css')
        .pipe(dest('dist/styles'))
        .pipe(browserSync.stream());
};

// Минификация HTML
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

// Обработка JavaScript
const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(concat('app.js'))
        .pipe(uglify().on('error', notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

// Обработка изображений
const images = () => {
    return src([
        'src/image/**/*.jpg',
        'src/image/**/*.png',
        'src/image/**/*.svg',
        'src/image/**/*.jpeg',
    ], { encoding: false })
        .pipe(image())
        .pipe(dest('dist/image'));
};

// Обработка favicon
const favicon = () => {
    return src('src/image/favicon.*')
        .pipe(dest('dist/image'));
};

// Обработка шрифтов
const fonts = () => {
    return src('src/fonts/**/*.woff2')
        .pipe(dest('dist/fonts'));
};

// Наблюдение за изменениями
const watchFiles = () => {
    browserSync.init({ server: { baseDir: 'dist' } });

    watch('src/**/*.html', htmlMinify);
    watch('src/styles/**/*.css', styles);
    watch('src/vendor/normalize.css', stylesNorm);
    watch('src/js/**/*.js', scripts);
    watch('src/image/favicon.*', favicon);
    watch('src/fonts/**/*.woff2', fonts);
};

// Экспорт задач
exports.clean = clean;
exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.images = images;
exports.stylesNorm = stylesNorm;
exports.favicon = favicon;
exports.fonts = fonts;

// Запуск по умолчанию
exports.default = series(clean, fonts, favicon, htmlMinify, scripts, styles, stylesNorm, images, watchFiles);
// Отдельный билд без watch
exports.build = series(clean, fonts, favicon, htmlMinify, scripts, styles, stylesNorm, images);
