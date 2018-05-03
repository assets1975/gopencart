/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var es, log, logFile;

const gulp = require('gulp-help')(require('gulp-param')(require('gulp'), process.argv));
//const gulp = require('gulp-param')(require('gulp'), process.argv);
const template       = require('gulp-template');
const rename         = require("gulp-rename");
const replaceName    = require('gulp-replace-name');
const gulpif         = require('gulp-if');
const ext            = require('gulp-ext');
const sass           = require('gulp-sass');
const browserSync    = require('browser-sync');
const cleanCSS       = require('gulp-clean-css');
const autoprefixer   = require('gulp-autoprefixer');
const bourbon        = require('node-bourbon');
const ftp            = require('vinyl-ftp');
const gutil          = require('gulp-util' );
const uglify         = require('gulp-uglify');
const sourcemaps     = require('gulp-sourcemaps');


es = require('event-stream');
log = require('gulp-util').log;

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

logFile = function (es) {
    return es.map(function (file, cb) {
        log("----");
        return cb();
    });
};

var condition = function (file) {
    // TODO: add business logic
    //log(file.path);
//  for(var f in file){
//   console.log(f+"----"+file["_contents"]);   
//  }
    console.log(file.path);
    return true;
};


gulp.task('gmodule', 'generate opencart 2.3.x.x module', function (modulename) {
    return gulp.src('templates/opencart_2_3/**/*.*')
            .pipe(ext.replace('.php', '._php'))                  // должен ити  первым в потоке
            .pipe(replaceName(/modulename/g, modulename))
            .pipe(replaceName(/_/g, '\\'))
            //.pipe(replaceName(/_php/g, 'php'))
            //.pipe(logFile(es))
            //.pipe(gulpif(condition,template({name:modulename})))
            //.pipe(template({ModuleName:modulename.capitalize()}))
            .pipe(template({
                name: modulename,
                Name: modulename.capitalize()
            }
            ))
            .pipe(gulp.dest('dist'));
}, {
    options: {
        'modulename': 'opencart module name'
    }
}
);

// Обновление страниц сайта на локальном сервере
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "http://localhost/opencart_pro/",
		notify: false
	});
});

// Компиляция *.scss
gulp.task('scss', function() {
	return gulp.src('dist/**/*.scss')
		.pipe(sourcemaps.init())
                .pipe(sass()) //Скомпилируем                
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
                .pipe(sourcemaps.write())
                .pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js','js compile', function () {
    gulp.src('dist/**/*.js') //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist')) //Выплюнем готовый файл в build
        .pipe(browserSync.reload({stream: true})); //И перезагрузим сервер
});

gulp.task('deploy','deploy to server', function() {
	var conn = ftp.create({
		host:      '127.0.0.1',
		user:      'admin',
		password:  '1234',
		parallel:  10,
		log: gutil.log
	});
	var globs = [
	'dist/**/*.min.js',
	'dist/**/*.php',
	'dist/**/*.min.css',
	'dist/**/*.tpl'
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/opencart_pro/'));
});

// Наблюдение за файлами
gulp.task('watch', function() {
	gulp.watch('dist/**/*.scss', ['scss']);
	gulp.watch('dist/**/*.*', ['browser-sync']);
	gulp.watch('dist/**/*.*', ['deploy']);
});

gulp.task('default', ['watch','scss','browser-sync','deploy']);

 