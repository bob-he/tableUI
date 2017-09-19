import gulp from 'gulp'
import babel from 'gulp-babel'

gulp.task('css', () => {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('lib'))
})

gulp.task('js', () => {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('lib'))
})

gulp.task('default', ['css', 'js'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'react', 'stage-0']
    }))
    .pipe(gulp.dest('lib'))
})
