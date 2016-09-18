'use strict';

const browserSync = require('browser-sync').create();

gulp.task('serve', () => {
  browserSync.init(config.params.webserver);

  browserSync.watch(config.params.public).on('change', browserSync.reload);
});
