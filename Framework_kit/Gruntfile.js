module.exports = function (grunt) {
    
    'use strict';

    var gruntConfig = {

        prefix      : 'td-vc-',

        srcPath     : 'content/web_resources/',
        destPath    : 'content/',

        watchFolder : '<%= grunt.task.current.args[1] %>',

        folder      : '<%= !grunt.task.current.args[1] ? grunt.task.current.args[0] : grunt.task.current.args[0] + \"/\" + grunt.task.current.args[1] %>',

        sass        : {
            dist : {
                options : {
                    sourcemap   : 'none',
                    noCache     : true,
                    style       : 'compressed'
                },
                files : {
                    '<%= destPath + folder %>/arquivos/<%= prefix %>framework.min.css' : '<%= srcPath + folder %>/sass/dest/<%= prefix %>framework.min.scss',
                    '<%= destPath + folder %>/arquivos/<%= prefix %>general.min.css' : '<%= srcPath + folder %>/sass/dest/<%= prefix %>general.min.scss'
                }
            }
        },
        concat      : {
            js    : {
                src     : [
                    '<%= srcPath + folder %>/js/0.PLUGIN.*.js',
                    '<%= srcPath + folder %>/js/1.*.js',
                    '<%= srcPath + folder %>/js/*.js'
                ],
                dest    : '<%= destPath + folder %>/arquivos/<%= prefix %>general.min.js',
            },
            framework : {
                src : [
                    '<%= srcPath + folder %>/sass/src/0.*.scss'
                ],
                dest : '<%= srcPath + folder %>/sass/dest/<%= prefix %>framework.min.scss',
            },
            general : {
                src : [
                    '<%= srcPath + folder %>/sass/src/*.scss',
                    '!<%= srcPath + folder %>/sass/src/0.*.scss'
                ],
                dest : '<%= srcPath + folder %>/sass/dest/<%= prefix %>general.min.scss',
            }
        },
        uglify      : {
            plugin : {
                files: {
                    '<%= destPath + folder %>/arquivos/<%= prefix %>plugin.min.js' : [ '<%= srcPath + folder %>/js/0.*.js' ]
                }
            },
            framework : {
                files: {
                    '<%= destPath + folder %>/arquivos/<%= prefix %>framework.min.js' : [ '<%= srcPath + folder %>/js/1.*.js' ]
                }
            },
            widget : {
                files: {
                    '<%= destPath + folder %>/arquivos/<%= prefix %>widget.min.js' : [ '<%= srcPath + folder %>/js/2.*.js' ]
                }
            },
            general : {
                files: {
                    '<%= destPath + folder %>/arquivos/<%= prefix %>general.min.js' : [ '<%= srcPath + folder %>/js/3.*.js', '<%= srcPath + folder %>/js/9.*.js', '<%= srcPath + folder %>/js/MainApplication.js' ]
                }
            }
        },
        jshint      : {
            files: [
                '<%= srcPath + folder %>/js/*.js',
                '!<%= srcPath + folder %>/js/0.*.js'
            ],
            options: {
                nonew   : true,
                newcap  : false,
                curly   : true,
                eqeqeq  : true,
                eqnull  : true,
                browser : true,
                globals : {
                    jQuery: true
                }
            }
        },
        includes    : {
            vtexInclude : {
                options : {
                    debug : true
                },
                files: [{
                    cwd  : '<%= srcPath + folder %>/templates/',
                    src  : '*.html',
                    dest : '<%= destPath + folder %>'
                }]
            },
            vtexTemplate : {
                options : {
                    filenameSuffix : '.html',
                    includePath    : '<%= srcPath + folder %>/templates/template',
                    includeRegexp  : /\<*vtex\:*template\s+id\=\"([^\"]*)\"\s*\/>/,
                    duplicates     : true, 
                    debug          : false
                },
                files: [{
                    cwd  : '<%= destPath + folder %>/',
                    src  : '*.html',
                    dest : '<%= destPath + folder %>'
                }]
            },
            vtexController : {
                options : {
                    filenameSuffix : '.html',
                    includePath    : '<%= srcPath + folder %>/templates/controller',
                    includeRegexp  : /\<*vtex\.cmc\:*([^\s]*)[^\/]*?\/\>/,
                    duplicates     : true,
                    debug          : false
                },
                files: [{
                    cwd  : '<%= destPath + folder %>/',
                    src  : '*.html',
                    dest : '<%= destPath + folder %>',
                }]
            }
        },
        concurrent  : {
            options: {
                logConcurrentOutput: true
            },
            project : [
                'watch:sass:<%= (grunt.task.current.args.join(":")) %>', 
                'watch:js:<%= (grunt.task.current.args.join(":")) %>',
                'watch:html:<%= (grunt.task.current.args.join(":")) %>'
            ]
        },
        watch       : {
            sass : {
                files: [

                    /*
                    ** SASS
                    *******/
                    '<%= srcPath + watchFolder %>/sass/src/*.scss'
                ],
                tasks: [

                    /*
                    ** SASS
                    *******/
                    'css:<%= watchFolder + (folder ? \":\" + folder : \"\") %>'
                ]
            },
            html : {
                files: [

                    /*
                    ** HTML
                    *******/
                    '<%= srcPath + watchFolder %>/templates/*.html',
                    '<%= srcPath + watchFolder %>/templates/template/*.html',
                    '<%= srcPath + watchFolder %>/templates/controller/*.html'
                ],
                tasks: [
                    
                    /*
                    ** HTML
                    *******/
                    'html:<%= watchFolder + (folder ? \":\" + folder : \"\") %>'
                ]
            },
            js : {
                files: [

                    /*
                    ** JS
                    *******/
                    '<%= srcPath + watchFolder %>/js/*.js'
                ],
                tasks: [

                    /*
                    ** JS
                    *******/
                    'js:<%= watchFolder %>'
                ],
            }
        }
    };

    grunt.initConfig(gruntConfig);

    /*
    ** CARREGANDO MODULOS
    *******/
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-includes');

    /*
    ** TASK CSS
    *******/
    grunt.registerTask('css', 'Minificando CSS', function (folder) {

        try {

            grunt.task.run([
                'concat:framework:' + folder,
                'concat:general:'   + folder,
                'sass:dist:'        + folder
            ]);
        } catch (error) {

            grunt.log.warn('Nothing worked, how it should work');
            grunt.log.warn('Error: ', error.message);
        }
    });

    /*
    ** TASK JS
    *******/
    grunt.registerTask('js', 'Minificando JS', function (folder) {

        try {

            grunt.task.run([
                'jshint:files:'     + folder, 
                //'concat:dist:'      + folder
                'uglify:plugin:'    + folder,
                'uglify:framework:' + folder,
                'uglify:widget:'    + folder,
                'uglify:general:'   + folder
            ]);
        } catch (error) {

            grunt.log.warn('Nothing worked, how it should work');
            grunt.log.warn('Error: ', error.message);
        }
    });

    /*
    ** HTML TASK
    *******/
    grunt.registerTask('html', 'Minificando HTML', function (folder) {

        try {

            grunt.task.run([
                'includes:vtexInclude:'     + folder, 
                'includes:vtexTemplate:'    + folder,
                'includes:vtexController:'  + folder,
                'includes:vtexTemplate:'    + folder
            ]);
        } catch (error) {

            grunt.log.warn('Nothing worked, how it should work');
            grunt.log.warn('Error: ', error.message);
        }
    });

    /*
    ** TASK DO MY JOB
    *******/
    grunt.registerTask('domyjob', 'Faça o meu trabalho', function (folder) {

        var srcPath     = gruntConfig.srcPath + folder,
            destPath    = gruntConfig.destPath + folder;

        try {

            if (grunt.file.exists(srcPath)) {

                if (grunt.file.exists(destPath)) {

                    grunt.task.run([
                        
                        /*
                        ** CSS
                        *******/
                        'concat:framework:' + folder,
                        'concat:general:'   + folder,
                        'sass:dist:'        + folder,

                        /*
                        ** JS
                        *******/
                        //'jshint:files:' + folder, 
                        'uglify:plugin:'    + folder,
                        'uglify:framework:' + folder,
                        'uglify:widget:'    + folder,
                        'uglify:general:'   + folder,

                        
                        /*
                        ** HTML
                        ******/
                        'includes:vtexInclude:'     + folder, 
                        'includes:vtexTemplate:'    + folder,
                        'includes:vtexController:'  + folder,
                        'includes:vtexTemplate:'    + folder, 

                        /*
                        ** WATCH
                        *******/
                        'concurrent:project:' + folder
                    ]);
                } else {

                    grunt.log.warn('Destination Folder not Found!');
                }
            } else {

                grunt.log.warn('Source Folder not Found!');
            }
        } catch (error) {

            grunt.log.warn('Nothing worked, how it should work');
            grunt.log.warn('Error: ', error.message);
        }
    });
};