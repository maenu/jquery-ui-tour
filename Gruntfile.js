module.exports = function(grunt) {
    grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: {
				coverage: 'bin/coverage'
			},
			doc: 'doc',
			lib: 'lib'
		},
		clean: {
			bin: 'bin',
			doc: 'doc'
		},
        jasmine: {
            src: '<%= meta.src.main %>/js/*.js',
			coverage: '<%= meta.bin.coverage %>/<%= meta.src.main %>/js/*.js',
            options: {
				vendor: [
					'<%= meta.lib %>/jquery-1.8.3.min.js',
					'node_modules/jquery-simula/jquery-simula-0.4.0.min.js',
					'<%= meta.lib %>/jquery-ui-1.9.2/jquery-ui-1.9.2.min.js'],
                template: '<%= meta.src.test %>/html/Coverage.tmpl',
                specs: '<%= meta.src.test %>/js/*.js'
            }
        },
        instrument : {
            files : '<%= meta.src.main %>/js/*.js',
            options : {
                basePath : '<%= meta.bin.coverage %>'
            }
        },
        storeCoverage : {
            options : {
                dir : '<%= meta.bin.coverage %>'
            }
        },
        makeReport : {
            src : '<%= meta.bin.coverage %>/*.json',
            options : {
                type : 'lcov',
                dir : '<%= meta.bin.coverage %>'
            }
        },
		uglify: {
			options: {
				banner: '/**\n'
						+ ' * <%= meta.package.name %> v<%= meta.package.version %>\n'
						+ ' * built on ' + '<%= grunt.template.today("dd.mm.yyyy") %>\n'
						+ ' * Copyright <%= grunt.template.today("yyyy") %> <%= meta.package.author.name %>\n'
						+ ' * licenced under MIT, see LICENSE.txt\n'
						+ ' */\n'
			},
			min: {
				files: {
					'<%= meta.package.name %>-<%= meta.package.version %>.min.js': '<%= meta.src.main %>/js/*.js'
				}
			}
		},
		yuidoc: {
			compile: {
				name: '<%= meta.package.name %>',
				description: '<%= meta.package.description %>',
				version: '<%= meta.package.version %>',
				options: {
					paths: '<%= meta.src.main %>',
					outdir: '<%= meta.doc %>'
				}
			}
		},
        jshint: {
			main: '<%= meta.src.main %>/js/*.js',
			test: '<%= meta.src.test %>/js/*.js',
            options: {
                // restrict
                bitwise: false,
                camelcase: true,
                curly: true,
                eqeqeq: false,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: false,
                trailing: true,
                maxparams: 5,
                maxdepth: 3,
                maxstatements: 42,
                maxcomplexity: 5,
                maxlen: 80,
                // relax
                sub: true,
                eqnull: true,
                laxbreak: true, // break on + etc.
				// environments
				browser: true,
				globals: {
					'jQuery': true
				}
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	
	grunt.registerTask('checkStyle', ['jshint:main', 'jshint:test']);
	grunt.registerTask('test', 'jasmine:src');
	grunt.registerTask('coverage', ['instrument', 'jasmine:coverage',
			'storeCoverage', 'makeReport']);
	grunt.registerTask('min', 'uglify:min');		
	grunt.registerTask('doc', 'yuidoc');
    
    // needed to make grunt-istanbul storeReport
    grunt.event.on('jasmine.coverage', function (coverage) {
        global.__coverage__ = coverage
    });
};