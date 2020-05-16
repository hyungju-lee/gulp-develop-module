import {parallel, series, watch} from "gulp";
import config from "../../config.json";
import {clean_css, clean_fonts, clean_html, clean_img, clean_js} from "../clean";
import {sprites, spriteSvg} from "../images";
import {sass} from "../css";
import {fontStyle, otf2ttf, ttf2ttf, ttfToWoff} from "../fonts";
import {eslint, libs, script} from "../js";
import {make_indexfile, process_html} from "../html";
import {browserSyncReload} from "../server";

export const gulpWatch = () => {
    watch(`${config.src}/img/**/*`, series(clean_img, parallel(spriteSvg, sprites), sass, browserSyncReload));
    watch(`${config.src}/fonts/`, series(clean_fonts, parallel(ttf2ttf, ttfToWoff, otf2ttf), fontStyle, sass, browserSyncReload))
    watch([
        `${config.src}/scss/**/*`,
        `!${config.src}/scss/libs/${config.libs.scss}`
    ], series(clean_css, sass, browserSyncReload));
    watch([
        `${config.src}/js/**/*`,
        `!${config.src}/js/libs/${config.libs.js}`
    ], series(clean_js, eslint, parallel(script, libs), browserSyncReload));
    watch(`${config.src}/html/**/*`, series(clean_html, parallel(make_indexfile, process_html), browserSyncReload));
    watch('index.html', series(make_indexfile, browserSyncReload));
}