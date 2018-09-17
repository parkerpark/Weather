// Gulp.js configuration
'use strict';

const

    // source and build folders
    dir = {
        src     : 'src/',
        build   : 'wwwroot/'
    },

    // Gulp and plugins
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    newer       = require('gulp-newer'),
    imagemin    = require('gulp-imagemin'),
    sass        = require('gulp-sass'),
    plumber     = require('gulp-plumber'),
    postcss     = require('gulp-postcss'),
    deporder    = require('gulp-deporder'),
    concat      = require('gulp-concat'),
    stripdebug  = require('gulp-strip-debug'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify');


let dev = true;

// Browser-sync
var browsersync = false;

// image settings
const images = {
    src         : dir.src + 'images/**/*',
    build       : dir.build + 'images/'
};

// image processing
gulp.task('images', () => {
    return gulp.src(images.src)
        .pipe(newer(images.build))
        .pipe(imagemin())
        .pipe(gulp.dest(images.build));
});


// CSS settings
var css = {
    src         : dir.src + 'scss/style.scss',
    watch       : dir.src + 'scss/**/*',
    build       : dir.build + 'css/',
    sassOpts: {
        outputStyle     : 'expanded',
        imagePath       : images.build,
        precision       : 10,
        errLogToConsole : true
    },
    processors: [
        require('postcss-assets')({
        loadPaths: ['images/'],
        basePath: dir.build,
        baseUrl: '/'
        }),
        require('autoprefixer')({
        browsers: ['last 2 versions', '> 2%']
        }),
        require('css-mqpacker'),
        require('cssnano')({ "safe": true })
    ]
};

// CSS processing
gulp.task('css', ['images'], () => {
    return gulp.src(css.src)
        .pipe(plumber())
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass(css.sassOpts))
        .pipe(postcss(css.processors))
        .pipe(gulpif(dev, sourcemaps.write('.')))
        .pipe(gulp.dest(css.build))
        
});


// JavaScript settings
const js = {
    src         : dir.src + 'js/**/*',
    build       : dir.build + 'js/'
    // filename    : 'site.js'
};

// JavaScript processing
gulp.task('js', () => {
    return gulp.src(js.src)
        .pipe(plumber())
        .pipe(gulpif(dev, sourcemaps.init()))
        // .pipe(deporder())
        // .pipe(concat(js.filename))
        .pipe(stripdebug())
        .pipe(uglify())
        .pipe(gulpif(dev, sourcemaps.write('.')))
        .pipe(gulp.dest(js.build))
        
});


// run all tasks
gulp.task('build', ['css', 'js', 'fonts']);


// Browsersync options
const syncOpts = {
    proxy       : 'localhost:40088',
    files       : dir.build + '**/*',
    open        : false,
    notify      : false,
    ghostMode   : false,
    ui: {
        port: 8001
    }
};

// browser-sync
gulp.task('browsersync', () => {
    if (browsersync === false) {
        browsersync = require('browser-sync').create();
        browsersync.init(syncOpts);
    }
});


// fonts settings
const fonts = {
    src         : dir.src + 'fonts/**/*',
    build       : dir.build + 'fonts/'
};

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
        .concat(fonts.src))
        .pipe(gulp.dest(fonts.build));
});


// watch for file changes
gulp.task('watch', ['browsersync'], () => {
    
    // image changes
    gulp.watch(images.src, ['images']);

    // CSS changes
    gulp.watch(css.watch, ['css']);

    // JavaScript main changes
    gulp.watch(js.src, ['js']);
    
    // HTML changes
    

});


// default task
gulp.task('default', ['build', 'watch']);
