'use-strict';
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const reload = browserSync.reload;
const cssnano = require('cssnano');
const pump = require('pump');
const environments = require('gulp-environments');
const development = environments.development;
const production = environments.production;
const uglify = require('gulp-uglify-es').default;
const rename = require("gulp-rename");
const del = require('del');

// Setup file paths
const paths = {
    src: 'app/**/*',
    srcHTML: 'app/**/*.html',
    srcSass: 'app/sass/**/*.scss',
    srcJS: 'app/**/*.js',
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/styles/',
    tmpJS: 'tmp/scripts/scripts.js',
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/styles/',
    distJS: 'dist/scripts/*.js'
};
const destPath = production() ? paths.dist : paths.tmp;

// copy html files into the temp folder
gulp.task('html', () => {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(destPath));
});

// generate css file from sass files, apply vendor prefixes, minify css
gulp.task('sass', () => {
    const plugins = [
        autoprefixer({ browsers: ['last 1 version'] }),
    ];

    if (production()) {
        plugins.push(cssnano());
    }

    return gulp.src(paths.srcSass)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest(`${destPath}/styles/`))
        .pipe(browserSync.stream());
});

// copy js files into the temp folder
gulp.task('js', (cb) => {
    const pumpOptions = [];
    pump([
        gulp.src(paths.srcJS),
        production(uglify()),
        gulp.dest(destPath)
    ],
        cb
    );
});

gulp.task('copy', gulp.series('html', 'sass', 'js'));

// TODO: Implement
gulp.task('clean:dist', function () {
    return del([
      'dist'
    ]);
  });

// Copy all files to tmp/dist folder and inject file paths into the index.html file
gulp.task('inject', gulp.series('copy', () => {
    return gulp.src(`${destPath}/index.html`)
        .pipe(inject(gulp.src(`${destPath}/styles/style.css`, { read: false }), { relative: true }))
        .pipe(inject(gulp.src(`${destPath}/scripts/scripts.js`, { read: false }), { relative: true }))
        .pipe(gulp.dest(destPath));
}));

// Serve the files from the tmp folder
gulp.task('serve', gulp.series('inject', () => {

    const dir = development() ? './tmp' : './dist';

    browserSync.init(
        {
            server: dir
        }
    );

    gulp.watch(paths.srcSass, gulp.series('sass'));
    gulp.watch(paths.srcHTML).on('change', gulp.series('inject', () => {
        browserSync.reload();
    }));
    gulp.watch(paths.srcJS).on('change', gulp.series('js', reload));
}));

gulp.task('default', gulp.series('serve'));
