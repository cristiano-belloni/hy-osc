'use strict'

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-include-replace'); 
	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.initConfig({
	  cssmin: {
          minify: {
          	  expand: true,
              src: ['style.css'],
              dest: 'inc/'
          }
      },
      htmlmin: {                                       	 // Task
            dist: {                                      // Target
              options: {                                 // Target options
                  removeComments: true,
                  collapseWhitespace: true
              },
              files: {                                   // Dictionary of files
                  'inc/template.html': 'template.html'  //dest: src
              }
            }
        },
	  includereplace: {
	    inject: {
	      options: {
	        // Task-specific options go here.
	        includesDir: 'inc/'
	      },
	      // Files to perform replacements and includes with
	      src: './osc.js',
	      // Destination directory to copy files to
	      dest: 'dist/'
	    }
	  }
	});

	grunt.registerTask('default', ['cssmin', 'htmlmin', 'includereplace']);

}