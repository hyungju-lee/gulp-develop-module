import {src, dest} from 'gulp';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import esLint from 'gulp-eslint';
import config from '../../config.json';

export const eslint = () => {
    return src(`${config.src}/js/*.js`)
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
}

export const script = () => {
    return src(`${config.src}/js/*.js`, {sourcemaps: true})
        .pipe(concat('script.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(`${config.dist}/js`, {sourcemaps: '.'}))
}

export const libs = () => {
    return src([
        './node_modules/jquery/dist/jquery.min.js',
    ])
        .pipe(concat(config.libs.js))
        .pipe(dest(`${config.src}/js/libs`))
        .pipe(dest(`${config.dist}/js/libs`))
};