import {src, dest} from 'gulp';
import zip from 'gulp-zip';
import packageJson from '../../package.json'
import config from '../../config.json';

export const zipFile = () => {
    const date = new Date(),
        dateFormatted = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}T${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(-2)}`;
    return src([
        `${config.dist}/**/*`,
        `!${config.dist}/**/*.zip`
    ])
        .pipe(zip(`${packageJson.name}_${packageJson.version}_${dateFormatted}.zip`))
        .pipe(dest(config.dist))
}