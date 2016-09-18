'use strict';

/**
 * @global gulp
 * @global config
 */

gulp.task('watch', () => {
  gulp.watch(config.src.scripts.all, ['scripts']);
  gulp.watch(config.src.templates.all, ['templates']);
  gulp.watch([config.src.styles.all, config.src.icons.all], ['styles']);
  gulp.watch(config.src.images.all, ['images']);
  gulp.watch(config.src.manifest.path, ['manifest']);
});
