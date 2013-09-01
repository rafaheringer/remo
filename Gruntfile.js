"use strict";

module.exports = function(grunt) {
	//Grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Uglify (minify JS)
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},

			//For APP
			chromeApp: {
				files: {
					'build/ChromeApp/player/masterPlayer/javascripts/<%= basename %>.min.js': ['player/masterPlayer/javascripts/<%= basename %>.js'],
					'build/ChromeApp/player/masterPlayer/javascripts/vendor/<%= basename %>.min.js': ['player/masterPlayer/javascripts/vendor/<%= basename %>.js']
				}
			}
		},

		//Clean release folders
		clean: {
			chromeApp: ['build/chromeApp'],
			webApp: ['build/webApp']
		},

		//SYNC for generate the deploy version
		copyto: {
			chromeApp: {
				files: [{
					cwd: 'player/',
					src: '**/*',
					dest: 'build/chromeApp/'
				}],
				options: {
					processContent: function(content, path) {
	          			return content;
		      		},
					ignore: [
					'player/**/.*', 'player/**/src{,/**/*}', 'player/**/RemoMusic*.*', 
					'player/bin{,/**/*}', 'player/bld{,/**/*}', 'player/**/*.rb', 'player/**/*.appcache',
					'player/*.appxmanifest', 'player/Package*.*'
					]
				}
			},
		},
		copy: {
			webApp: {
				files: {
					'build/webApp/manifest.json': 'player/manifest.web.json',
					'build/webApp/masterPlayer/images/app/': 'player/masterPlayer/images/app/*.*',
				}
			}
		}
	});



	//Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-copy-to');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	//And register tasks
	grunt.registerTask('deploy', ['clean','copyto','copy']);
};