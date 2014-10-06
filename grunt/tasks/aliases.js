/* Grunt task aliases */

'use strict';

module.exports = function (grunt) {

  grunt.registerTask(
    'default',
    [
      'jshint',
      'concat',
      'autoprefixer',
      'cssmin',
      'browserify',
      'uglify',
      'clean'
    ]
  );

  grunt.registerTask(
    'dev',
    [
      'default',
      'connect',
      'watch'
    ]
  );

};
