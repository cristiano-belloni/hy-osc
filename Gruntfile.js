'use strict'

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.initConfig({
	  cssmin: {
          minify: {
          	  expand: true,
              src: ['style.css'],
              dest: 'dist/'
          }
      },
      htmlmin: {                                       	 // Task
            dist: {                                      // Target
              options: {                                 // Target options
                  removeComments: true,
                  collapseWhitespace: true
              },
              files: {                                   // Dictionary of files
                  'dist/template.html': 'template.html'  //dest: src
              }
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['osc.js'], dest: 'dist/'},
                ]
            }
        }
	});

	grunt.registerTask('default', ['cssmin', 'htmlmin', 'copy']);

}