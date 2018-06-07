/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// let es;
let log;
// let logFile;


const gulp = require('gulp-help')(require('gulp-param')(require('gulp'),
             process.argv));
// const gulp = require('gulp-param')(require('gulp'), process.argv);
const template = require('gulp-template');
const rename = require('gulp-rename');
const replaceName = require('gulp-replace-name');
// const gulpif         = require('gulp-if');
const ext = require('gulp-ext');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// const bourbon        = require('node-bourbon');
const ftp = require('vinyl-ftp');
const gutil = require('gulp-util' );
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');


es = require('event-stream');
log = require('gulp-util').log;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

logFile = function(es) {
    return es.map(function(file, cb) {
        log('----');
        return cb();
    });
};

// let condition = function(file) {
//     console.log(file.path);
//     return true;
// };

// run gulp gmodule --modulename test_module_name
gulp.task('gmodule', 'generate opencart 2.3.x.x module', function(modulename) {
    return gulp.src('templates/opencart_2_3/extension/module/**/*.*')
            .pipe(plumber())
            .pipe(ext.replace('.php', '._php')) // должен ити  первым в потоке
            .pipe(replaceName(/modulename/g, modulename))
            .pipe(replaceName(/_/g, '\\'))
            // .pipe(replaceName(/_php/g, 'php'))
            // .pipe(logFile(es))
            // .pipe(gulpif(condition,template({name:modulename})))
            // .pipe(template({ModuleName:modulename.capitalize()}))
            .pipe(template({
                name: modulename,
                Name: modulename.capitalize()
            }
            ))
            .pipe(gulp.dest('dist/'));
}, {
    options: {
        'modulename': 'opencart module name'
    }
}
);


// run gulp gnewepayxtension --modulename test_module_name
gulp.task('gnewpayextension',
          'generate opencart 2.3.x.x payment module', function(modulename) {
    return gulp.src('templates/opencart_2_3/extension/payment/**/*.*')
            .pipe(plumber())
            .pipe(ext.replace('.php', '._php')) // должен ити  первым в потоке
            .pipe(replaceName(/modulename/g, modulename))
            .pipe(replaceName(/_/g, '\\'))
            // .pipe(replaceName(/_php/g, 'php'))
            // .pipe(logFile(es))
            // .pipe(gulpif(condition,template({name:modulename})))
            // .pipe(template({ModuleName:modulename.capitalize()}))
            .pipe(template({
                name: modulename,
                Name: modulename.capitalize()
            }
            ))
            .pipe(gulp.dest('dist/'));
}, {
    options: {
        'modulename': 'opencart module name'
    }
}
);

// создает новую страницу в common
// нужно создать новую схему и указать путь
// common/newpage где newpage название новой страницы

gulp.task('gnewpage',
'generate opencart 2.3.x.x new page "common/newpage"', function(newpagename) {
    console.log(newpagename);
    return gulp.src('templates/opencart_2_3/common/**/*.*')
            .pipe(plumber())
            .pipe(ext.replace('.php', '._php')) // должен ити  первым в потоке
            .pipe(replaceName(/newpagename/g, newpagename))
            .pipe(replaceName(/_/g, '\\'))
            .pipe(template({
                name: newpagename,
                Name: newpagename.capitalize()
            }
            ))
            .pipe(gulp.dest('dist/'));
}, {
    options: {
        'newpagename': 'new page name '
    }
}
);

// Обновление страниц сайта на локальном сервере
// Нужно указать proxy
gulp.task('browser-sync', function() {
browserSync({
    proxy: 'http://localhost/opencart_pro/',
    notify: false
});
});

// Компиляция *.scss
gulp.task('scss', function() {
    return gulp.src('dist/**/*.scss')
.pipe(plumber())
.pipe(sourcemaps.init())
.pipe(sass()) // Скомпилируем
.pipe(autoprefixer(['last 15 versions']))
.pipe(cleanCSS().on('error', gutil.log))
.pipe(sourcemaps.write())
.pipe(rename({suffix: '.min'}))
.pipe(gulp.dest('dist'))
.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', 'js compile', function() {
    gulp.src('dist/**/*.js') // Найдем наш main файл
        .pipe(plumber())
        .pipe(sourcemaps.init()) // Инициализируем sourcemap
        .pipe(uglify()) // Сожмем наш js
        .pipe(sourcemaps.write()) // Пропишем карты
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist')) // Выплюнем готовый файл в build
        .pipe(browserSync.reload({stream: true})); // И перезагрузим сервер
});

gulp.task('deploy', 'deploy to server', function() {
let conn = ftp.create({
host: '127.0.0.1',
user: 'admin',
password: '1234',
parallel: 10,
log: gutil.log
});
let globs = [
'dist/**/*.min.js',
'dist/**/*.php',
'dist/**/*.min.css',
'dist/**/*.tpl'
];
return gulp.src(globs, {buffer: false}).pipe(conn.dest('/opencart_pro/'));
});
// gulp deploy-hosting
gulp.task('deploy-hosting', 'deploy to hosting', function() {
let conn = ftp.create({
    host: 'http://opencartpro.asset-saparov.kz', // hosting ftp
    user: '', // ftp user name
    password: '', // ftppassword
    parallel: 10,
    log: gutil.log
});
let globs = [
'dist/**/*.min.js',
'dist/**/*.php',
'dist/**/*.min.css',
'dist/**/*.tpl'
];
return gulp.src(globs, {buffer: false})
.pipe(conn.dest('/opencartpro.asset-saparov.kz/'));
});

// Наблюдение за файлами
gulp.task('watch', function() {
gulp.watch('dist/**/*.scss', ['scss']);
gulp.watch('dist/**/*.*', ['browser-sync']);
gulp.watch('dist/**/*.*', ['deploy']);
});

gulp.task('default', ['watch', 'scss', 'browser-sync', 'deploy']);
