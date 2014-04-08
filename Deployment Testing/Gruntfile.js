module.exports = function (grunt){

	//Project configuration
	grunt.initConfig({
		
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			deploymentJS: {
				options: {
					banner: '/*! Uglified on: <%= grunt.template.today("yyyy-mm-dd") %> from http://edusvcs.fireeye.com/js */\n',
					mangle: false,
					preserveComments: false,
					compress: true,
					report: "min"
				},
				files: [{
					expand: true,
					cwd: "H://www/js",
					src: "**/*.js",
					dest: "deploy/toCMS/js/",
					ext: ".min.js"
				}]
			}
		},
		cssmin: {
			main: {
				options: {
					banner: '/*! Compressed on: <%= grunt.template.today("yyyy-mm-dd") %> from http://edusvcs.fireeye.com/css */\n',
					report: "min"
				},
				files: [{
					expand: true,
					cwd: "H://www/css",
					src: "**/*.css",
					dest: "deploy/toCMS/css/",
					ext: ".min.css"
				}]
			},
			minifyOneOffs: {
				options: {
					banner: '/*! Compressed on: <%= grunt.template.today("yyyy-mm-dd") %> from http://edusvcs.fireeye.com/css */\n',
					report: "min"
				},
				files: [{
					expand: true,
					cwd: "deploy/",
					src: "Lesson*/**/*.css",
					dest: "deploy/",
					ext: ".min.css"
				}]
			}
		},
		/**needs further configuration once CDN is available **/
		'ftp-deploy': {
			build: {
				auth: {
					host: 'server.com',
					port: 21,
					authKey: 'key1'
				},
				//example given:
				src: '/source',
				dest: '/path/to/destination/folder',
				exclusions: ['path/to/source/folder/**/.DS_Store', 'path/to/source/folder/**/Thumbs.db', 'dist/tmp']
				//preferred, most-likely scenario:
				/*
				files: [{
					expand: true,
					cwd: "deploy/toCMS/",
					src: ["js/**", "css/**"],
					dest: "assets/**"
				}]*/				
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: "source/",
				src: ["Lesson1/**", "Lesson2/**", "Lesson4/**", "Lesson6/**"],
				dest: "deploy/"
			},
			addGenericLessons: {
				expand: true,
				cwd: "D://Git Repos/fireeye-appliance-configuration/source/", //later this should be changed to "../fireeye-appliance-configuration/source/". This sort of structure doesn't exist in the sandbox. Ideally this would copy the deploy folder, not the source one.
				src: ["Lesson3/**", "Lesson5/**"],
				dest: "deploy/"
			},
			devServerExport: {
				expand: true,
				cwd: "deploy/",
				src: ["Lesson*/**"],
				dest: "H://www/course-testing/grunttest/"
			}
		},
		replace: {
			deployPaths: {
				options:{
					patterns: [{						
						match: "http://edusvcs.fireeye.com/",
						replacement: "<%= pkg.deployServer %>"
					}, {
						match: "http://assets.sprockomatic.com/",
						replacement: "<%= pkg.deployServer %>"
					}, {
						match: 'http://pwk.io/',
						replacement: "<%= pkg.deployServer %>"
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					cwd: "deploy/",
					src: "Lesson*/**/index.html",
					dest: "deploy/"
				}]
			},
			refMin: {
				options:{
					patterns: [{						
						match: '/[.]css/g',
						replacement: '.min.css',
						expression: true
					}, {
						match: '/[.]js/g',
						replacement: '.min.js',
						expression: true
					}, {
						//in case something got... double-minned
						match: ".min.min",
						replacement: ".min",
						expression: false
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					cwd: "deploy/",
					src: "Lesson*/**/index.html",
					dest: "deploy/"
				}]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-ftp-deploy");
	grunt.loadNpmTasks("grunt-replace");
	
	grunt.registerTask("uglifySharedJS", ["uglify:deploymentJS"]);
	grunt.registerTask("minifySharedCSS", ["cssmin"]);
	grunt.registerTask("minifyOneOffs", ["cssmin:minifyOneOffs"]);
	grunt.registerTask("addGenericLessons", ["copy:addGenericLessons"]);
	grunt.registerTask("setDeployPaths", ["replace:deployPaths", "replace:refMin"]);
	grunt.registerTask("exportToDev", ["copy:devServerExport"]);
	
	grunt.registerTask("default", ["uglify:deploymentJS", "cssmin", "copy", "copy:addGenericLessons", "cssmin:minifyOneOffs", "replace:deployPaths", "replace:refMin", "copy:devServerExport"]);
};