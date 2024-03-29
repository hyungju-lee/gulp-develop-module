import {src} from 'gulp';
import ghPages from 'gulp-gh-pages';
import config from '../../config.json';

export const source_deploy = () => {
    return src([
        `${config.dist}/**/*`,
        `!${config.dist}/**/*.map`
    ])
        .pipe(ghPages({
            message: config.deployMessage
        }))
}