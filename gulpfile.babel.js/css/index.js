import {src, dest} from 'gulp';
import concat from 'gulp-concat';
import sassGlob from 'gulp-sass-glob';
import sassCompile from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import config from '../../config.json';

export const css_libraries = () => {
    return src([
        './node_modules/normalize.css/normalize.css',
    ])
        .pipe(concat(config.libs.scss))
        .pipe(dest(`${config.src}/scss/libs`))
}

export const sass = () => {
    return src(`${config.src}/scss/**/*.{scss, sass}`, {sourcemaps: true})
        .pipe(sassGlob())
        .pipe(sassCompile({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }).on('error', sassCompile.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: config.autoprefixer,
            remove: false,
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(`${config.dist}/css`, {sourcemaps: '.'}))
}