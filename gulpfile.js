'use strict';

/**
 * Set gulp to global
 */
global.gulp   = require('gulp');

/**
 * Set global variables
 */
global.config = require('./gulp.config');

/**
 * Tasks paths
 */
require('require-dir')('./tasks', { recurse: true });
