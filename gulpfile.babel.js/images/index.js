import fs from "fs";
import path from "path";
import {src, dest, lastRun} from 'gulp';
import imagemin from 'gulp-imagemin';
import spritesmith from 'gulp.spritesmith-multi';
import svgSprite from 'gulp-svg-sprite';
import sort from 'gulp-sort';
import pngquant from 'gulp-pngquant';
import vinylBuffer from 'vinyl-buffer';
import merge from 'merge-stream';
import config from '../../config.json';

export const optimize_imgs = () => {
    return src([
        `${config.src}/img/**/*.{png, gif, jpg, svg}`,
        `!${config.src}/img/sprites/**/*`,
        `!${config.src}/img/sprites-svg/**/*`
    ], { since: lastRun(optimize_imgs) })
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(dest(`${config.dist}/img/`))
}

export const sprites = () => {
    const opts = {
        spritesmith: function (options, sprite, icons) {
            options.imgPath = `../img/${options.imgName}`;
            options.cssName = `_${sprite}-mixins.scss`;
            options.cssTemplate = `${config.src}/scss/vendor/spritesmith-mixins.handlebars`;
            options.cssSpritesheetName = sprite;
            options.padding = 4;
            options.algorithm = 'binary-tree';
            return options
        }
    };

    const spriteData = src(`${config.src}/img/sprites/**/*.png`)
        .pipe(spritesmith(opts)).on('error', function (err) {
            console.log(err)
        });

    const imgStream = spriteData.img
        .pipe(vinylBuffer())
        .pipe(pngquant({
            quality: '90'
        }))
        .pipe(dest(`${config.dist}/img`));

    const cssStream = spriteData.css
        .pipe(dest(`${config.src}/scss/vendor`));

    return merge(imgStream, cssStream)
}

export const spriteSvg = (done) => {
    const svgPath = `${config.src}/img/sprites-svg`,
        folders = fs.readdirSync(svgPath).filter((file) => fs.statSync(path.join(svgPath, file)).isDirectory()),
        options = {
            spritesmith: (options) => {
                const {folder, config} = options;
                return {
                    shape: {
                        spacing: {
                            padding: 4
                        },
                        id: {
                            generator: function (name) {
                                return path.basename(name.split(`${config.src}/scss/vendor`).join(this.separator), '.svg');
                            }
                        }
                    },
                    mode: {
                        css: {
                            dest: './',
                            bust: false,
                            sprite: folder + '-svg.svg',
                            render: {
                                scss: {
                                    template: path.join(`${config.src}/scss/vendor`, 'sprite-svg-mixins.handlebars'),
                                    dest: path.posix.relative(`${config.src}/img`, path.posix.join(`${config.src}/scss`, 'vendor', '_' + folder + '-svg-mixins.scss'))
                                }
                            }
                        }
                    },
                    variables: {
                        spriteName: folder,
                        baseName: path.posix.relative(`${config.src}/css`, path.posix.join(`${config.src}/img`, folder + '-svg')),
                        svgToPng: ''
                    }
                }
            }
        }

    folders.map((folder) => {
        return new Promise((resolve) => {
            src(path.join(`${config.src}/img/sprites-svg`, folder, '*.svg'))
                .pipe(sort())
                .pipe(svgSprite(options.spritesmith({folder, config})))
                .pipe(dest(`${config.src}/img`))
                .on('end', resolve);
        });
    });
    done();
}