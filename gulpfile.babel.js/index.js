import {series, parallel} from 'gulp';
import {clean_dist} from './clean';
import {script, libs, eslint} from './js';
import {sass, css_libraries} from './css';
import {source_deploy} from './deploy';
import {ttfToWoff, ttf2ttf, otf2ttf, fontStyle} from './fonts';
import {process_html, make_indexfile} from './html';
import {optimize_imgs, spriteSvg, sprites} from './images';
import {server} from './server';
import {gulpWatch} from './watch';
import {zipFile} from './zip';

exports.default = series(clean_dist, parallel(css_libraries, optimize_imgs, spriteSvg, sprites, ttfToWoff, otf2ttf, ttf2ttf), fontStyle,
    sass, eslint, parallel(script, libs, make_indexfile, process_html), parallel(server, gulpWatch));

exports.build = series(clean_dist, parallel(css_libraries, optimize_imgs, spriteSvg, sprites, ttfToWoff, otf2ttf, ttf2ttf), fontStyle,
    sass, eslint, parallel(script, libs, make_indexfile, process_html), zipFile);

exports.deploy = series(clean_dist, parallel(css_libraries, optimize_imgs, spriteSvg, sprites, ttfToWoff, otf2ttf, ttf2ttf), fontStyle,
    sass, eslint, parallel(script, libs, make_indexfile, process_html), zipFile, source_deploy);