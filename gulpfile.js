const { watch, series, src, dest, parallel, task } = require('gulp');
const path = require("path");
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const reload = browserSync.reload;
const steamReload = browserSync.stream;
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cssmin = require('gulp-clean-css');
const cache = require('gulp-cache');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require("gulp-sourcemaps");
const gulpRemoveHtml = require('gulp-remove-html');
const removeEmptyLines = require('gulp-remove-empty-lines');
const clean = require('gulp-clean');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fileinclude = require('gulp-file-include');
const minimist = require('minimist');
const gutil = require('gulp-util');


const baseDir = path.resolve(__dirname, './src');
const buildPath = path.resolve(__dirname, './dist');

//区分是否是serve模式
let isServe = process.env.NODE_ENV == "development";

//默认development环境
var knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

var options = minimist(process.argv.slice(2), knowOptions);

//生成filename文件，存入string内容
function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true })
    src._read = function() {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: Buffer.from(string) }))
        this.push(null)
    }
    return src
}

function constantsTask(cb) {
    var myConfig = require('./config.json');
    //取出对应的配置信息
    var envConfig = myConfig[options.env];
    console.log(myConfig)
    console.log(options.env)
    console.log(envConfig)
    var conConfig = 'appconfig = ' + JSON.stringify(envConfig);
    //生成config.js文件
    return string_src("config.js", conConfig)
        .pipe(dest('src/js/'))
}




function cleanTask(cb) {
    return src(buildPath, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }))
        .on('end', cb);
}

function copyTask(cb) {
    return src([baseDir + '/**/*.+(swf|eot|ttf|woff|woff2|otf|mp4)'])
        .pipe(dest(buildPath))
        .pipe(src(baseDir + '/libs/**/*'))
        .pipe(dest(buildPath + '/libs'))
        .on('end', cb);
}

function imgTask(cb) {
    return src(baseDir + '/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(dest(buildPath))
        .on('end', cb);
}

function cssTask(cb) {
    return src(baseDir + '/**/*.css')
        .pipe(gulpif(!isServe, cssmin({
            rebase: false
        })))
        .pipe(dest(buildPath))
        .pipe(gulpif(isServe, steamReload()))
        .on('end', cb);
}

function sassTask(cb) {
    return src([baseDir + '/**/*.scss', baseDir + '/**/*.sass'])
        .pipe(gulpif(isServe, sourcemaps.init()))
        .pipe(sass())
        .pipe(cssmin({
            rebase: false
        }))
        .pipe(gulpif(isServe, sourcemaps.write(".")))
        .pipe(dest(buildPath))
        .pipe(gulpif(isServe, steamReload()))
        .on('end', cb);
}

function jsTask(cb) {
    return src([baseDir + '/**/*.js', '!' + baseDir + '/**/*.min.js'])
        .pipe(gulpif(isServe, sourcemaps.init()))
        .pipe(babel({
            presets: ['@babel/env']
            // presets: ['env']
        }))
        .pipe(uglify({
            mangle: { reserved: ['require', 'exports', 'module', '$'] }, //排除混淆关键字,false to skip mangling names.
            compress: true //类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulpif(isServe, sourcemaps.write(".")))
        .pipe(dest(buildPath))
        .on('end', cb);
}

function htmlTask(cb) {
    return src(baseDir + '/**/*.html')
        .pipe(gulpRemoveHtml()) //清除特定标签
        .pipe(removeEmptyLines({ removeComments: true })) //清除空白行
        .pipe(fileinclude({
            prefix: '@@', //引用符号
            basepath: './src/include', //引用文件路径
        }))
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: false, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(dest(buildPath))
        .on('end', cb);
}


var jsonPlaceholderProxy = createProxyMiddleware('/api', {
    target: 'https://zipimgs.com/api',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    pathRewrite: {
        '^/api': ''
    },
    logLevel: 'debug'
})

function serverTask(cb) {

    browserSync.init({
        port: 3001,
        server: {

            baseDir: buildPath,
            middleware: [jsonPlaceholderProxy]
        }
    });
    cb();
}


function watchTask(cb) {
    watch(['src/**/*.+(swf|eot|ttf|woff|woff2|otf|mp4|min.js)', 'src/libs/**/*'], copyTask).on('all', reload);
    watch("src/**/*.+(png|jpg|jpeg|gif|svg)", imgTask).on('all', reload);
    watch("src/**/*.html", htmlTask).on('change', reload);
    watch("src/**/*.js", jsTask).on('all', reload);
    watch("src/**/*.css", cssTask)
    watch(["src/**/*.sass", "src/**/*.scss"], sassTask);
    cb();
}


exports.serve = series(
    constantsTask,
    cleanTask,
    copyTask,
    parallel(
        imgTask,
        cssTask,
        sassTask,
        jsTask,
        htmlTask
    ),
    serverTask,
    watchTask
);

exports.build = series(
    constantsTask,
    cleanTask,
    copyTask,
    parallel(
        imgTask,
        cssTask,
        sassTask,
        jsTask,
        htmlTask
    )
);

exports.clean = cleanTask