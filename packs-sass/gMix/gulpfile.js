var 
  gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  concat = require('gulp-concat');

// TASK PARA O SASS
gulp.task('concat', function(){
    return gulp.src('./core/*.scss')
    .pipe(concat('_gmix.scss'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function(){


});