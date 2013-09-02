"use strict";

module.exports = function(grunt) {
	//Grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
					'player/*.appxmanifest', 'player/Package*.*',
					'/player/masterPlayer/javascripts/*.js', '/player/masterPlayer/javascripts/vendor/*.js'	//UGLIFY
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
		},

		//Uglify (minify JS)
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				compress: true
			},

			//For APP
			chromeApp: {
				files: grunt.file.expandMapping(['./player/masterPlayer/javascripts/*.js', './player/masterPlayer/javascripts/vendor/*.js'], './build/chromeApp/masterPlayer/javascripts/', {
					rename: function(destBase,destPath) {
						return destBase+destPath.replace('./player/masterPlayer/javascripts/','');
					}
				})
			}
		},
	});

	//Load plugins
	grunt.loadNpmTasks('grunt-copy-to');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	//And register tasks
	grunt.registerTask('deploy', ['clean','copyto','copy','uglify']);
};