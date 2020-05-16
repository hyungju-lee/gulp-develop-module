import del from 'del';
import config from '../../config.json';

export const clean_dist = () => {
    return del([
        config.dist,
        `${config.src}/scss/libs/*`,
        `!${config.src}/scss/libs/${config.libs.scss}`,
        `${config.src}/js/libs/*`,
        `!${config.src}/js/libs/${config.libs.js}`
    ])
};

export const clean_css = () => {
    return del([
        `${config.dist}/css`,
        `${config.src}/scss/libs/*`,
        `!${config.src}/scss/libs/${config.libs.scss}`
    ])
};

export const clean_fonts = () => {
    return del(`${config.dist}/fonts`)
}

export const clean_js = () => {
    return del([
        `${config.dist}/js`,
        `${config.src}/js/libs/*`,
        `!${config.src}/js/libs/${config.libs.js}`
    ])
};

export const clean_html = () => {
    return del(`${config.dist}/html`)
};

export const clean_img = () => {
    return del(`${config.dist}/img`)
};