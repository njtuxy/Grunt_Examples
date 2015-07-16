module.exports = function(grunt){
	grunt.config.init({
		pkg: grunt.file.readJSON('package.json'),
		copyFiles: {
			options: {
				workingDirectory: 'working',
				manifest: ['index.html', 'stylesheets/', 'javascripts/']
			}
		},
		createVersionFile: {
			options: {
				workingDirectory: '<%= copyFiles.options.workingDirectory%>'
			}
		}

	});

	grunt.registerTask('deploy', 'Deploy all files', ['deleteFolder', 'createFolder', 'copyFiles', 'createVersionFile']);

	grunt.registerTask('createFolder', 'Create the working folder', function(){
		grunt.config.requires('copyFiles.options.workingDirectory');
		grunt.file.mkdir(grunt.config.get('copyFiles.options.workingDirectory'));
	});

	grunt.registerTask('deleteFolder', 'Delete the working folder', function(){
		grunt.config.requires('copyFiles.options.workingDirectory');
		grunt.file.delete(grunt.config.get('copyFiles.options.workingDirectory'));
	});

	grunt.registerTask('copyFiles', 'Copy the mainfest files to working folder', function(){
		this.requires('deleteFolder');
		var files, workingDir;
		grunt.config.requires('copyFiles.options.workingDirectory');
		grunt.config.requires('copyFiles.options.manifest');
		files = grunt.config.get('copyFiles.options.manifest');
		workingDir = grunt.config.get('copyFiles.options.workingDirectory');
		files.forEach(function (file) {
			recursiveCopy(file, workingDir);
		});
	});

	grunt.registerTask('createVersionFile', 'Create a version file in working folder', function(){
		this.requires('copyFiles');
		var workingDir = this.options().workingDirectory;
		var content = '<%=pkg.name%> version <%=pkg.version%>';
		content = grunt.template.process(content);
		grunt.log.writeln('WorkingDir: ' + this.options().workingDirectory);
		grunt.file.write(workingDir + '/version.txt', content);
	});




	var recursiveCopy = function(source, destination){
		if(grunt.file.isDir(source)){
			grunt.file.recurse(source, function (file) {
				recursiveCopy(file, destination)
			})
		}
		else{
			grunt.log.writeln('Copy ' + source + ' to ' + destination);
			grunt.file.copy(source, destination + "/" + source)
		}
	}

};