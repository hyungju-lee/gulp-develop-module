import fs from "fs";
import path from "path";
import {src, dest} from 'gulp';
import ejs from 'gulp-ejs';
import gitRepoInfo from 'git-repo-info';
import gitLog from 'gitlog';
import cheerio from 'cheerio';
import config from '../../config.json';

export const process_html = () => {
    return src([
        `${config.src}/html/**/*.html`,
        `!${config.src}/html/**/@*`,
        `!${config.src}/html/includes/**/*`
    ])
        .pipe(ejs(config.ejsVars))
        .pipe(dest(`${config.dist}/html`))
}

export const make_indexfile = () => {
    const dPath = `${config.src}/html/`, // index를 생성할 파일들이 있는 저장소
        info = gitRepoInfo(), // git 정보 생성
        fileInfo = fs.readdirSync(dPath); // 파일 목록 불러오는 함수를 동기적으로 수정
    let normalFiles = []; // 파일 정보를 저장할 배열 생성

    fileInfo.map(function (file) {
        return path.join(dPath, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    }).forEach(function (file) {
        let stats = fs.statSync(file);
        //HTML 파일만 거르기
        let extname = path.extname(file),
            basename = path.basename(file);
        if (extname == '.html') {
            // 일반 file info를 저장할 객체 생성
            let nfileData = {};
            // title 텍스트 값 추출
            let fileInnerText = fs.readFileSync(file, 'utf8');
            let $ = cheerio.load(fileInnerText);
            let wholeTitle = $('title').text(),
                splitTitle = wholeTitle.split(' : ');
            // 객체에 데이터 집어넣기
            nfileData.title = splitTitle[0];
            nfileData.name = basename;
            nfileData.category = String(nfileData.name).substring(0, 2);
            nfileData.categoryText = splitTitle[1];
            nfileData.mdate = new Date(stats.mtime);
            // 파일수정시점 - 대한민국 표준시 기준
            nfileData.ndate = nfileData.mdate.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}) + ' (GMT+9)';
            // title 마지막 조각 , 인덱스에 붙은 라벨 식별 및 yet 인 경우 수정날짜정보 제거
            nfileData.status = splitTitle[2];
            if (typeof splitTitle[2] == 'undefined' || splitTitle[2] == null || splitTitle[2] == '') {
                nfileData.status = '';
            } else if (splitTitle[2] == 'yet') {
                nfileData.mdate = '';
                nfileData.ndate = '';
            }
            normalFiles.push(nfileData);
        }
    });

    const gitOptions = {
        repo: __dirname,
        number: 20,
        fields: ["hash", "abbrevHash", "subject", "body", "authorName", "authorDateRel", "committerDate", "committerDateRel"],
        execOptions: {maxBuffer: 1000 * 1024},
    };

    let commits;

    try {
        commits = gitLog(gitOptions).reverse();
    } catch (err) {
        console.log(err);
    }

    let log;

    if (commits) {
        log = true;
        for (let i = 0; i < normalFiles.length; i++) {
            for (let j = 0; j < commits.length; j++) {
                let boolean = commits[j].files.filter((x) => {
                    if (path.extname(x) === '.html') return x
                }).map((x) => path.basename(x)).some(x => x === normalFiles[i].name);
                if (boolean) {
                    normalFiles[i].committerDate = new Date(commits[j].committerDate).toLocaleDateString();
                    normalFiles[i].abbrevHash = commits[j].abbrevHash;
                }
            }
        }
    } else {
        log = false;
    }

    let projectObj = {
        nfiles: normalFiles,
        branch: info.branch,
        commits: log,
    }
    let projectObjStr = JSON.stringify(projectObj);
    let projectObjJson = JSON.parse(projectObjStr);

    //index 파일 쓰기
    return src('index.html')
        .pipe(ejs(projectObjJson))
        .pipe(dest(config.dist))
}