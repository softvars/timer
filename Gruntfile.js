// Generated on 2017-05-08 using generator-angular 0.16.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  var serveStatic = require('serve-static');
  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    configureProxies: 'grunt-connect-proxy',
    exec: 'grunt-exec'
  });

  var packageJson = require('./package.json');
  // Configurable paths for the application
  var appConfig = {
    app: packageJson.srcPath,
    dist: packageJson.distPath,
    wepAppFolder: packageJson.wepAppFolder
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/{scripts,vendor}/{,*/}*.js'],
        tasks: ['injector', 'newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test'/*, 'karma' */]
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['injector', 'newer:copy:styles', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['injector']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/**/*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35730
      },
      /* proxies: [
        {
          context: ['/smsservice/api/', '/smsservice/smsApi/'],
          host: 'localhost',
          port: 3000
        }
      ], */
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              require('connect-modrewrite') (['!(\\..+)$ / [L]']),
              serveStatic('.tmp'),
              connect().use(
                serveStatic('./' + appConfig.app)
              ),
              serveStatic('./' + appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          /*base: '<%= yeoman.dist %>',*/
          middleware: function (connect) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              require('connect-modrewrite') (['!(\\..+)$ / [L]']),
              connect().use(
                serveStatic('./dist')
              ),
              serveStatic('./' + appConfig.dist)
            ];
          }
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Executing shell commands.
    /* exec: {
      bowerInstaller: 'bower-installer'
    }, */

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      options: {
        force: true //Need to set to true, when moving to other directories
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      webapp: {
        files: [{
          dot: true,
          src: appConfig.wepAppFolder +'{,*/}/*'
        }]
      },
      vendor: '<%= yeoman.app %>/vendor/{,*/}*',
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    injector: {
      options: {
        ignorePath: '<%= yeoman.app %>/', // strips 'app/' from the urls of files
        addRootSlash: false
      },
      dev: {
        files: {
          '<%= yeoman.app %>/index.html': [
            '<%= yeoman.app %>/scripts/const.js',
            '<%= yeoman.app %>/scripts/storage.js',
            '<%= yeoman.app %>/scripts/utils.js',
            '<%= yeoman.app %>/scripts/JSONReader.js',
            '<%= yeoman.app %>/scripts/main.js',
            '<%= yeoman.app %>/scripts/**/*.js',
            '<%= yeoman.app %>/styles/normalize.css',
            '<%= yeoman.app %>/styles/main.css',
            '<%= yeoman.app %>/styles/app.css',
            '<%= yeoman.app %>/scripts/**/*.css'
          ]
        }
      },
      vendor: {
        options: {
          starttag: '<!-- injector:vendor:{{ext}} -->'
        },
        files: {
          '<%= yeoman.app %>/index.html': [
            '<%= yeoman.app %>/vendor/libs/jquery-1.12.0.min.js',
            '<%= yeoman.app %>/vendor/libs/bootstrap.min.js',
            '<%= yeoman.app %>/vendor/libs/FileSaver.min.js',
            '<%= yeoman.app %>/vendor/libs/date_fns.v1.29.0.min.js',
            '<%= yeoman.app %>/vendor/libs/*.js',
            '<%= yeoman.app %>/vendor/css/bootstrap.min.css'
          ]
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {
              js: [{
                name: 'concat',
                createConfig: function (context) {
                  context.options.generated.options = {
                    sourceMap: true
                  };
                }
              }, {
                name: 'uglify',
                createConfig: function (context, block) {
                  context.options.generated.options = {
                    sourceMap : true,
                    /*sourceMap.includeSources: true,*/
                    sourceMapIn: '.tmp/concat/' + block.dest.replace('.js', '.js.map')
                  };
                }
              }]
            }
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/*.css', '<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/*.js', '<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          /*collapseBooleanAttributes: true,*/
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/vendor/fonts',
          dest: '<%= yeoman.dist %>/fonts',
          src: ['**/*']
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      webapp: {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.dist %>',
        dest: appConfig.wepAppFolder,
        src :  '**/*'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        /* 'imagemin', */
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


/*   grunt.registerTask('bower-installer', [
    'clean:vendor',
    'exec:bowerInstaller'
  ]);
 */
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'configureProxies', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'injector',
      'concurrent:server',
      'postcss:server',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

/*   grunt.registerTask('test', [
    'clean:server',
    'injector',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]); */

  grunt.registerTask('build', [
    'clean:dist',
    'injector',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('buildc', [
    'clean:webapp',
    'build',
    'copy:webapp'
  ]);

  grunt.registerTask('default', [
    /* 'newer:jshint', */
    /* 'newer:jscs', */
    /* 'test', */
    'build'
  ]);
};
