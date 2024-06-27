import { src, dest, series, watch } from "gulp";
import concat from "gulp-concat";
import gulpAutoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import dartSass from 'sass';
import uglify from "gulp-uglify";
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import svgSprite from "gulp-svg-sprite";
import { deleteAsync } from "del";
import babel from 'gulp-babel';
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";

// Очистка папки dist
const clean = () => {
  return deleteAsync(["dist"]);
};

const scripts = () => {
  return src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

// Копирование HTML (без минификации)
const htmlCopy = () => {
  return src("src/**/*.html")
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

// Создание SVG спрайта
const svgSprites = () => {
  return src("src/images/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("dist/images"));
};

// Копирование изображений
const copyImages = () => {
  return src('src/images/**/*.{jpg,png,gif,svg}')
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream());
};

// Стили
const styles = () => {
  return src("src/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(concat("main.css"))
    .pipe(
      gulpAutoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
          },
          2: {
            mergeAdjacentRules: true,
            mergeIntoShorthands: true,
            mergeMedia: true,
            mergeRules: true,
            minifySelectors: true,
            removeEmpty: true,
            removeUnusedAtRules: false,
          },
        },
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

// Наблюдение за изменениями файлов
const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });

  watch("src/**/*.html", htmlCopy);
  watch("src/styles/**/*.scss", styles);
  watch("src/images/svg/**/*.svg", svgSprites);
  watch("src/images/**/*", copyImages);
  watch("src/**/*.js", scripts);
};

// Сборка проекта
const build = series(clean, htmlCopy, styles, svgSprites, copyImages, scripts);
const dev = series(clean, htmlCopy, styles, svgSprites, copyImages, scripts, watchFiles);

export {
  clean,
  styles,
  htmlCopy,
  copyImages,
  svgSprites,
  watchFiles,
  build,
  dev,
  scripts,
};

export default dev;
