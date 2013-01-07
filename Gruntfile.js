module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: {
				coverage: 'bin/coverage',
				temporary: 'bin/temporary'
			},
			doc: 'doc',
			lib: 'lib',
			banner: '/**\n'
					+ ' * <%= meta.package.name %> v<%= meta.package.version %>\n'
					+ ' * built on ' + '<%= grunt.template.today("dd.mm.yyyy") %>\n'
					+ ' * Copyright <%= grunt.template.today("yyyy") %> <%= meta.package.author.name %>\n'
					+ ' * licenced under MIT, see LICENSE.txt\n'
					+ ' */\n'
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
				banner: '<%= meta.banner %>'
			},
			min: {
				files: {
					'<%= meta.package.name %>-<%= meta.package.version %>.min.js': '<%= meta.src.main %>/js/*.js'
				}
			}
		},
		concat: {
			css: {
				src: '<%= meta.src.main %>/css/*.css',
				dest: '<%= meta.bin.temporary %>/all.css'
			}
		},
		cssmin: {
			options: {
				banner: '<%= meta.banner %>'
			},
			min: {
				src: '<%= meta.bin.temporary %>/all.css',
				dest: '<%= meta.package.name %>-<%= meta.package.version %>.min.css'
			}
		},
		csslint: {
			src: {
				src: '<%= meta.src.main %>/css/*.css',
				rules: {
					'important': true,
					'adjoining-classes': true,
					'known-properties': true,
					'box-sizing': true,
					'box-model': true,
					'outline-none': true,
					'duplicate-background-images': true,
					'compatible-vendor-prefixes': true,
					'display-property-grouping': true,
					'qualified-headings': true,
					'fallback-colors': true,
					'duplicate-properties': true,
					'empty-rules': true,
					'errors': true,
					'shorthand': true,
					'ids': true,
					'gradients': true,
					'font-sizes': true,
					'font-faces': true,
					'floats': true,
					'underscore-property-hack': true,
					'overqualified-elements': true,
					'import': true,
					'regex-selectors': true,
					'rules-count': true,
					'star-property-hack': true,
					'text-indent': true,
					'unique-headings': true,
					'universal-selector': true,
					'unqualified-attributes': true,
					'vendor-prefix': true,
					'zero-units': true
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
		}
	});
	
	grunt.loadNpmTasks('grunt-istanbul');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-css');
	
	grunt.registerTask('check', ['jshint:main', 'jshint:test', 'csslint:src']);
	grunt.registerTask('test', 'jasmine:src');
	grunt.registerTask('coverage', ['instrument', 'jasmine:coverage',
			'storeCoverage', 'makeReport']);
	grunt.registerTask('min', ['uglify:min', 'concat:css', 'cssmin:min']);	
	grunt.registerTask('doc', 'yuidoc');
	
	// needed to make grunt-istanbul storeReport
	grunt.event.on('jasmine.coverage', function (coverage) {
		global.__coverage__ = coverage
	});
};