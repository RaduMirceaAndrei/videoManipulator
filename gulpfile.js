//required node modules that gulp uses for building, watching, server etc.
//poate sa le numesc mai bine
var gulp = require('gulp'); //gulp
var sass = require('gulp-sass'); //sass plugin
var sync = require('browser-sync').create(); //browser sync (server)
var gulpIf = require('gulp-if'); //helps with minifications of js/css files based on type
var useref = require('gulp-useref'); //concatention of files
var uglify = require('gulp-uglify'); //minification of js files
var cssnano = require('gulp-cssnano'); //minification of css files
var imagemin = require('gulp-imagemin'); //minification of images
var cache = require('gulp-cache'); //cache images - so we don't optimize needlesly
var del = require('del'); //clean up folders
var sequence = require('run-sequence'); //execute tasks in sequance


//sass to css task
gulp.task('sass-to-css', function(){
    return gulp.src('app/frontend/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/frontend/css'))
    .pipe(sync.reload({ //reincarca browser-sync 
        stream: true //prin streaming
    }));
});

//spawn server task
gulp.task('browserSync', function(){
    sync.init({ //metoda de instantiere a serverului
        server: { //obiectul de configurare
            baseDir: '' //server root
        },
    })
});
gulp.task('watch',['browserSync'/*, 'sass-to-css'*/], function(){ //argumentul 2 este pentru taskuri ce trebuie facute inainte de a rula watch-urile
    //gulp.watch('app/frontend/scss/**/*.scss', ['sass-to-css']);
    gulp.watch('*.html', sync.reload);
    gulp.watch('*.js', sync.reload);

    //alte watchere
});


//concatenate js files
gulp.task('useref', function(){
    return gulp.src('imageuploader/app/frontent/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) //minifica fisierele .js, folosind gulpIf
    .pipe(gulpIf('*.css', cssnano())) //minifica fisierele de .css, folosing gulpIf
    .pipe(gulp.dest('dist'));
});

//optimise images - run only if needed
gulp.task('imagemin', function(){
    return gulp.src('imageuploader/app/frontent/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin(
        //optiuni aici
    )))
    .pipe(gulp.dest('dist/images'))
});

//copy fonts
gulp.task('fonts', function(){
    return gulp.src('imageuploader/app/frontent/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

//clean up distribution folder
gulp.task('clean-dist', function(){
    return del.sync('dist');
});

//run tasks in sequance
gulp.task('sequance', function(){
    sequence('clean-dist', ['useref', 'watch']); //task1, ['task2', 'task3'] - array runs in paralel
})

//watch task - ar trebui scrisa ultima (in afara de minificari)
//gulp.task('watch',['browserSync', 'sass-to-css'], function(){ //argumentul 2 este pentru taskuri ce trebuie facute inainte de a rula watch-urile
    //gulp.watch('imageuploader/scss/**/*.scss', ['sass-to-css']);
    //gulp.watch('imageuploader/*.html', sync.reload);
    //gulp.watch('imageuploader/js/**/*.js', sync.reload);
    //alte watchere
//});



