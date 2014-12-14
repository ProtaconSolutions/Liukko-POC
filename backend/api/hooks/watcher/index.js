'use strict';

var path = require('path');
var chokidar = require('chokidar');
var fs = require('fs');
var _ = require('lodash');

module.exports = function watcherHook(sails) {
    return {
        // Default configuration for hook
        defaults: function defaults() {
            /**
             * Return the default configuration, which will be merged into the Sails config if not overridden by the
             * user.
             */
            return {
                watcherHook: {
                    files: [
                        {
                            path: 'file_01.txt',
                            name: 'File watcher 1',
                            room: 'watcher_01'
                        },
                        {
                            path: 'file_02.txt',
                            name: 'File watcher 2',
                            room: 'watcher_02'
                        },
                        {
                            path: 'file_03.txt',
                            name: 'File watcher 3',
                            room: 'watcher_03'
                        },
                        {
                            path: 'file_04.txt',
                            name: 'File watcher 4',
                            room: 'watcher_04'
                        }
                    ]
                }
            };
        },

        /**
         * Initialize the hook
         *
         * @param  {Function}   next    Callback for when we're done initializing
         */
        initialize: function initialize(next) {
            // If the hook has been deactivated, just return
            if (sails.config.watcherHook.files.length === 0) {
                sails.log.verbose("POC file listener hook deactivated. No files configured at this moment...");

                return next();
            }

            // Normalize files to watch, basically just add some base path to each files
            var filesToWatch = _.map(sails.config.watcherHook.files, function iterator(file) {
                return path.resolve(sails.config.appPath, 'data') + '/' + file.path;
            });

            // Watch all specified files
            var watcher = chokidar.watch(filesToWatch, {
                // Ignore the initial "add" events which are generated when Chokidar starts watching files
                ignoreInitial: true,
                persistent: true
            });

            /**
             * Whenever something changes on those specified files. Debounce the event handler so that in only fires
             * after receiving all of the change events.
             */
            watcher.on('change', sails.util.debounce(function debounce(file, stats) {
                sails.log.verbose('Detected POC file change -- ' + path);

                // Read changed file contents
                fs.readFile(file, 'utf8', function callback(error, data) {
                    if (error) {
                        sails.log.error('File read error on POC hook - ' + path);
                        sails.log.error(error);
                    } else {
                        sails.log.verbose('File changed content is now:');
                        sails.log.verbose(data);

                        // Determine file configuration
                        var fileConfig = _.find(sails.config.watcherHook.files, function iterator(_file) {
                            return path.resolve(sails.config.appPath, 'data') + '/' + _file.path == file;
                        });

                        if (fileConfig) {
                            // Blast socket event to all subscribers
                            sails.sockets.blast(fileConfig.room, {data: data, stats: stats});
                        } else {
                            sails.log.error('File configuration not found for file - ' + file);
                        }
                    }
                });
            }, 100));

            // We're done initializing.
            return next();
        }
    };
};
