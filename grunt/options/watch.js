/* grunt-contrib-watch */

'use strict';

module.exports = {
  javascript: {
    options: {
      livereload: true
    },
    tasks: [
      'jshint',
      'browserify',
      'uglify'
    ],
    files: [
      'src/js/**/*.js'
    ]
  },
  css: {
    options: {
      livereload: true
    },
    tasks: [
      'concat',
      'autoprefixer',
      'cssmin'
    ],
    files: [
      'src/css/**/*.css'
    ]
  }
};
