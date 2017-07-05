'use strict';
const
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins({
    pattern: "*"
  }),
  gulp = require('gulp'),
  fs = require('fs'),
  ftp = require("./ftp.json");

var env = process.env.NODE_ENV || 'local'; //local | ftp

var buildType = 'min' // min | full

var conn = plugins.vinylFtp.create(ftp.conf);

var ignorinc = 'app';

var htmlBeautifyOptions = {
  "indent_size": 2
};

var libsPath = require('./gulp_map.json');

//what do you want to use?
var libs = {
  susy: libsPath.susy,
  jquery:libsPath.jquery,
  //drawer:libsPath.drawer,
  bxslider:libsPath.bxslider,
 // raphael:libsPath.raphael,
  msgBox:libsPath.msgBox,
  breakpoint: libsPath.breakpoint,
 // bourbon: libsPath.bourbon,
 // bootstrap: libsPath.bootstrap,
  slick: libsPath.slick,
  formValidator: libsPath.formValidator,
  //select:libsPath.select,
  fancybox:libsPath.fancybox,
  //icheck:libsPath.icheck,
  //placeholder:libsPath.placeholder,
  //fullpage:libsPath.fullpage,
};
var root = "./app/";

var configServer = {
  tunnel: false,
  host: 'intellect.local',
  logPrefix: "Frontend_Devil",
  proxy: 'intellect.local',
  port: 9000,
  browser: "firefox",
};

var path = {
  build: {
    html: root,
    js: root + 'js/',
    css: root + 'css/',
    img: root + 'images/',
    fonts: root + 'fonts/',
    libs: root + 'libs/',
    sprite: '../images/',
  },
  src: {
    html: 'src/template/pages/*.html',
    js: 'src/js/**/*.*',
    style: ['src/style/**/*.scss', '!src/style/libs/**/*.scss'],
    libStyle: 'src/style/libs/**/*.scss',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    libs: 'src/libs/**/*.*',
    sprite: 'src/style/helpers/'
  },
  watch: {
    html: 'src/template/**/*.html',
    js: 'src/js/**/*.*',
    style: 'src/style/**/*.scss',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    sprite: 'src/sprites/*.png'
  },
  clean: 'build'
};

var swigOpt = {
  load_json: true,
  json_path: './src/template/data/',
  defaults: {
    cache: false
  }
};

var sassOptions = {
  outputStyle: 'expanded'
};

/*clear build directory*/
function clean() {

  return plugins.del(root + '*');
}

function html_build() {

  return gulp.src(path.src.html)
    .pipe(plugins.newer(path.src.html))
    .pipe(plugins.swig(swigOpt).on('error', plugins.notify.onError(function (e) {
      console.log(e);
      return "AHTUNG TWIG ERROR!!"
    })))
    .pipe(plugins.htmlBeautify(htmlBeautifyOptions))
    .pipe(plugins.remember('html'))
    .pipe(plugins.if(env === "ftp", conn.dest(root)))
    .pipe(plugins.if(env === "local", gulp.dest(path.build.html)))
    .on('end', plugins.browserSync.reload);
}

function js_build() {

  return gulp.src(path.src.js)
    .pipe(plugins.if(buildType === "min", plugins.concat('all.js')))
	  .pipe(plugins.if(buildType === "min", plugins.jsmin()))
    .pipe(plugins.if(env === "ftp", conn.dest(path.build.js)))
    .pipe(plugins.if(env === "local", gulp.dest(path.build.js)))
    .on('end', plugins.browserSync.reload);
}

function style_build() {

  return gulp.src(path.src.style)
    .pipe(plugins.newer(path.build.css))
    .pipe(plugins.sass(sassOptions).on('error', plugins.notify.onError(function (e) {
      console.log(e);
      return "AHTUNG SASS ERROR!!"
    })))
    .pipe(plugins.autoprefixer({
      browsers: ['last 16 versions'],
      cascade: false
    }))
    .pipe(plugins.if(buildType === "min", plugins.cssmin()))
    .pipe(plugins.remember('style'))
    .pipe(plugins.if(env === "ftp", conn.dest(path.build.css)))
    .pipe(plugins.if(env === "local", gulp.dest(path.build.css)))
    .on('end', plugins.browserSync.reload);
}

function image_build() {

  return gulp.src(path.src.img, {

    })
    .pipe(plugins.newer(path.build.img))
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [plugins.imageminPngquant()],
      interlaced: true
    }))
    .pipe(plugins.remember('image'))
    .pipe(plugins.if(env === "ftp", conn.dest(path.build.img)))
    .pipe(plugins.if(env === "local", gulp.dest(path.build.img)))
    .on('end', plugins.browserSync.reload);
}

function sprite_build() {

  var spriteData = gulp.src('src/sprites/*.png')
    .pipe(plugins.newer(path.build.img))
    .pipe(plugins.spritesmith({
      imgName: 'sprite.png',
      imgPath:path.build.sprite+'sprite.png',
      cssName: '_sprite.scss',
      cssTemplate: 'src/style/helpers/_sprite_template.handlebars'
    }));
  spriteData.pipe(plugins.remember('sprite'))
  spriteData.img.pipe(plugins.if(env === "ftp", conn.dest(root)))
  spriteData.img.pipe(plugins.if(env === "local", gulp.dest(path.build.img)))
  return spriteData.css.pipe(gulp.dest(path.src.sprite));
}

function fonts_build() {

  return gulp.src(path.src.fonts)
    .pipe(plugins.newer(path.build.fonts))
    .pipe(gulp.dest(path.build.fonts))
    .pipe(plugins.if(env === "ftp", conn.dest(path.build.fonts)))
    .pipe(plugins.if(env === "local", gulp.dest(path.build.fonts)))
    .pipe(plugins.browserSync.stream());
}

//install libs
function lib_build(cb) {
	 for (var item in libs) {
		var nameLib = item;
		for (var fileType in libs[item]) {
		  for (var i = 0; libs[item][fileType].length > i; i++) {
  			var path = libs[item][fileType][i];
  			if (fileType === 'scss') {
  			  if (!fs.existsSync('src/style/libs/' + nameLib))
  				gulp.src(path).pipe(gulp.dest('src/style/libs/'));
  			} else {
  			  gulp.src(path)
  				.pipe(plugins.if(env === "ftp", conn.dest(root + '/libs/' + nameLib + '/' + fileType + '/')))
  				.pipe(plugins.if(env === "local", (gulp.dest(root + 'libs/' + nameLib + '/' + fileType + '/'))))
  			}
		  }
		}
	}
 cb();
}
/*inject css js to index file*/
function inc_build() {
  var stream = gulp.src('src/template/layouts/master.html')
    .pipe(plugins.inject(gulp.src([
        root + 'js/**/*.js', "!"+root + 'js/**/jquery.min.js'
   ], {
      read: false
    }), {
      name: 'dev',
      ignorePath: ignorinc,
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(plugins.inject(gulp.src([
        root + 'css/**/*.css'
   ], {
      read: false
    }), {
      name: 'dev',
      ignorePath: ignorinc,
      addPrefix: '.',
      addRootSlash: false
    })).pipe(plugins.inject(gulp.src([
        root + 'libs/**/*.js',"!"+root + 'libs/**/jquery.min.js'
   ], {
      read: false
    }), {
      name: 'libs',
      ignorePath: ignorinc,
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(plugins.inject(gulp.src([
        root + 'libs/**/*.css'
   ], {
      read: false
    }), {
      name: 'libs',
      ignorePath: ignorinc,
      addPrefix: '.',
      addRootSlash: false
    }))
	;
  return stream.pipe(gulp.dest('src/template/layouts/'));
}

function webserver() {

  return plugins.browserSync(configServer);
}

var build = gulp.series(
    sprite_build,
    gulp.parallel(
    lib_build,
    fonts_build,
    image_build,
    style_build,
    js_build
  ),
  inc_build,
  html_build
);

function upload() {
  var conn = plugins.vinylFtp.create(ftp.conf);
  var stream = gulp.src(ftp.files, {
      base: '.',
      buffer: true
    })
    .pipe(conn.dest(ftp.pathToServer));
  return stream.pipe(plugins.browserSync.stream());
}

function watch() {

  gulp.watch(path.watch.html, html_build).on('unlink', function (filepath) {
    return plugins.remember.forget('html', plugins.resolvePath(filepath));
  });
  gulp.watch(path.watch.style, style_build).on('unlink', function (filepath) {
    return plugins.remember.forget('style', plugins.resolvePath(filepath));
  });

  gulp.watch(path.watch.js, js_build).on('unlink', function (filepath) {
    return plugins.remember.forget('js', plugins.resolvePath(filepath));
  });

  gulp.watch(path.watch.img, image_build).on('unlink', function (filepath) {
    return plugins.remember.forget('image', plugins.resolvePath(filepath));
  });

  gulp.watch(path.watch.sprite, sprite_build).on('unlink', function (filepath) {
    return plugins.remember.forget('sprite', plugins.resolvePath(filepath));
  });

  gulp.watch(path.watch.fonts, fonts_build);

}

exports.clean = clean;
exports.webserver = webserver;
exports.build = build;
exports.watch = watch;
exports.html_build = html_build;
exports.js_build = js_build;
exports.style_build = style_build;
exports.image_build = image_build;
exports.sprite_build = sprite_build;
exports.fonts_build = fonts_build;
exports.inc_build = inc_build;
exports.lib_build = lib_build;
exports.upload = upload;
////////
exports.default = gulp.series(build,
  gulp.parallel(watch, webserver));
