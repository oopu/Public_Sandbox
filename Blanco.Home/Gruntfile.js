module.exports = function (grunt){
	
	/**TO DO:
	* Check out what it'll take to FTP files directly to S3 bukkit
	* Hook deploy build tasks on Git commit
	* Concat min.css files into global.min.css
	*/
	
	//Project configuration
	grunt.initConfig({
		
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			deploymentJS: {
				options: {
					banner: '/*! Uglified on: <%= grunt.template.today("yyyy-mm-dd") %>*/\n',
					mangle: false,
					preserveComments: false,
					compress: true,
					report: "min"
				},
				files: [{
					expand: true,
					cwd: "source/js",
					src: "**/*.js",
					dest: "deploy/js/",
					ext: ".min.js"
				}]
			}
		},
		cssmin: {
			main: {
				options: {
					banner: '/*! Compressed on: <%= grunt.template.today("yyyy-mm-dd") %>*/\n',
					report: "min"
				},
				files: [{
					expand: true,
					cwd: "source/css",
					src: "**/*.css",
					dest: "deploy/css/",
					ext: ".min.css"
				}]
			}
		},
		replace: {
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
					cwd: "source/",
					src: "*.html",
					dest: "deploy/"
				}]
			}
		},
		imagemin: {
			staticJPGs: { //since for now I only have one specific file to worry about
				files: [{
					"deploy/img/self.jpg" : "source/img/self.jpg"
				}]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-ftp-deploy");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks("grunt-contrib-imagemin");

	grunt.registerTask("uglifySharedJS", ["uglify:deploymentJS"]);
	grunt.registerTask("minifySharedCSS", ["cssmin"]);
	grunt.registerTask("setDeployPaths", ["replace:refMin"]);
	grunt.registerTask("minImgs", ["imagemin:staticJPGs"]);
	
	grunt.registerTask("default", ["uglify:deploymentJS", "cssmin", "replace:refMin"]);
};