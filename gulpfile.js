const { src, dest, watch, series, parallel } = require('gulp');

// Dependencias de CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Dependencias de Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    // Compilar SASS
    // Pasos: 1. Identificar archivo a compliar; 2. Compilarla; 3. Guardar el .css; estos los define por medio de gulp (a traves de sus pipes)

    src('src/scss/app.scss')                        // paso 1 _ Identificar el archivo principal .scss
        .pipe(sourcemaps.init())                    // Inicializa el Sourcemaps
        .pipe( sass() )                             // paso 2 _ Compilar
        .pipe(postcss([ autoprefixer(), cssnano() ]))          // Hace compatible el codigo css a los navegadores
        .pipe(sourcemaps.write('.'))                // Los escribe antes de guardarlos
        .pipe(dest('build/css'))                    // paso 3 _ Guardar

    done()
}

function imagenes () {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

function versionWebp(){
    const opciones = {
        quality: 50
        }
    return src('src/img/**/*{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
}

function versionAvif(){
    const opciones = {
    quality: 50
    }
    return src('src/img/**/*{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
}

function dev() {
    watch( 'src/scss/**/*.scss', css )
    watch( 'src/img/**/*', imagenes )
// toma dos valores, el primero es que debo prestarle atencion, verifica si hay cambios en el archivo y luego vuelve a llamar a la funcion 
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev ); //Se recomienda dejar la tarea que tiene el watch al final

// Series - Se inicia una tarea, hasta que finaliza, se inicia la siguiente
// Parallel - Todas inician al mismo tiempo