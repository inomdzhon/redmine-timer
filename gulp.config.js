'use strict';

 /**
  * 1. params - plugins params
  * 2. src - source path
  * 3. public - public path
  */
module.exports = {
  params: { /* 1 */
    webserver: {
      server: {
        baseDir: 'public/'
      },
      open: false,
      notify: false,
      tunnel: false,
      host: 'localhost',
      port: 9000,
      logPrefix: 'L-D-T'
    },

    stylus: {
      'include css': true
    },

    cssBase64: {
      baseDir: '../icons',
      extensionsAllowed: ['.gif', '.png', '.svg']
    }
  },

  src: { /* 2 */
    path: 'src/',

    templates: {
      all: 'src/pages/**/*.*',
      path: 'src/pages/',
      main: 'src/pages/*.*'
    },

    styles: {
      all: 'src/styles/**/*.styl',
      path: 'src/styles/',
      main: 'src/styles/*.styl'
    },

    images: {
      all: 'src/images/*.*',
      path: 'src/images/',
    },

    icons: {
      all: 'src/icons/**/*.*',
      path: 'src/icons/'
    },

    scripts: {
      all: 'src/scripts/**/*.js',
      path: 'src/scripts/',
    },

    manifest: {
      path: 'src/manifest.json'
    }
  },

  public: { /* 3 */
    path: 'public/',

    styles: {
      all: 'public/assets/css/**/*.css',
      path: 'public/assets/css/'
    },

    images: {
      all: 'public/assets/images/**/*.*',
      path: 'public/assets/images/'
    },

    scripts: {
      all: 'public/assets/js/**/*.js',
      path: 'public/assets/js/',
    }
  }
};
