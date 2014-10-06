/* grunt-contrib-uglify */

'use strict';

module.exports = {
  dist: {
    options: {
      banner: '<%= pkg.banner %>',
      wrap: true
    },
    files: {
      'public/tildeclub.min.js': [
        'public/tildeclub.js'
      ]
    }
  }
};
