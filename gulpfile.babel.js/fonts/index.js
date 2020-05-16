import fs from "fs";
import {src, dest} from 'gulp';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import fonter from 'gulp-fonter';
import config from '../../config.json';

export const ttf2ttf = () => {
    return src(`${config.src}/fonts/*.ttf`)
        .pipe(dest(`${config.dist}/fonts/`))
}

export const ttfToWoff = () => {
    src(`${config.src}/fonts/*.ttf`)
        .pipe(ttf2woff())
        .pipe(dest(`${config.dist}/fonts/`))
    return src(`${config.src}/fonts/*.ttf`)
        .pipe(ttf2woff2())
        .pipe(dest(`${config.dist}/fonts/`))
}

export const otf2ttf = () => {
    return src(`${config.src}/fonts/*.otf`)
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(`${config.dist}/fonts/`))
}

export const fontStyle = (done) => {
    fs.writeFileSync(`${config.src}/scss/common/_fonts.scss`, '');
    fs.readdir(`${config.dist}/fonts/`, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFileSync(`${config.src}/scss/common/_fonts.scss`, '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n');
                }
                c_fontname = fontname;
            }
        }
    })
    done();
}