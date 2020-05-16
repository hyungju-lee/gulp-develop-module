import browser from 'browser-sync';
import config from '../../config.json';

const browserSync = browser.create();

export const browserSyncReload = (done) => {
    browserSync.reload();
    done();
}

export const server = () => {
    // serve files from the build folder
    browserSync.init({
        port: 8030,
        ui: {
            port: 8033,
            weinre: {
                port: 8133
            }
        },
        cors: false, // if you need CORS, set true
        server: {
            baseDir: `${config.dist}/`
        }
    });

    console.log('\x1b[32m%s\x1b[0m', '[--:--:--] HTML/SCSS watch complete...');
};