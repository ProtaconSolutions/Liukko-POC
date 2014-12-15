'use strict';

var path = require('path');
var chokidar = require('chokidar');
var fs = require('fs');
var _ = require('lodash');

/**
 * Watcher hook.
 *
 * This file contains a custom hook, that will be handling actual "watching" of specified files and if those changes
 * hook will emit a socket message about that change to every client who is "listening" file specified socket room.
 *
 * @todo
 *  1) How to handle new files?
 *  2) Figure out how to wait for 'initializer' hook
 */
module.exports = function hook(sails) {
    return {
        /**
         * Hook initialize.
         *
         * @param   {Function}  next    Callback function to call after all is done
         */
        initialize: function initialize(next) {
            var hook = this;
            var eventsToWaitFor = [];

            if (sails.hooks.orm) {
                eventsToWaitFor.push('hook:orm:loaded');
            }

            if (sails.hooks.sockets) {
                eventsToWaitFor.push('hook:sockets:loaded');
            }

            sails.after(eventsToWaitFor, function() {
                hook._determineFilesToWatch(next);
            });
        },

        /**
         * Private hook function to determine all files to watch with this hook.
         *
         * @param   {Function}  next    Callback function to call after all is done
         * @private
         */
        _determineFilesToWatch: function _determineFilesToWatch(next) {
            var hook = this;

            sails.models['file']
                .find()
                .exec(function exec(error, files) {
                    if (error) {
                        next(error);
                    } else {
                        hook._watchFiles(files, next);
                    }
                });
        },

        /**
         * Private hook method to activate actual watcher.
         *
         * @param   {Array}     files   Array of files that are going to be watched
         * @param   {Function}  next    Callback function to call after all is done
         * @private
         */
        _watchFiles: function _watchFiles(files, next) {
            /**
             * Ignore the initial "add" events which are generated when Chokidar starts watching files. Also we need
             * to make persistent check of these files. And we need to use polling to get all updates from certain
             * files.
             */
            var watcher = chokidar.watch(_.pluck(files, 'path'), {
                ignoreInitial: true,
                persistent: true,
                usePolling: true
            });

            /**
             * Whenever something changes on those specified files. Debounce the event handler so that in only fires
             * after receiving all of the change events.
             */
            watcher.on('change', sails.util.debounce(function debounce(file, stats) {
                sails.log.verbose('Detected POC file change -- ' + file);

                // Read changed file contents
                fs.readFile(file, 'utf8', function callback(error, data) {
                    if (error) {
                        sails.log.error('File read error on POC hook - ' + file);
                        sails.log.error(error);
                    } else {
                        sails.log.verbose('File changed content is now:');
                        sails.log.verbose(data);

                        // Determine file configuration
                        var fileConfig = _.find(files, function iterator(_file) {
                            return _file.path === file;
                        });

                        if (fileConfig) {
                            // Emit socket event to all subscribers
                            sails.sockets.emit(
                                sails.sockets.subscribers(fileConfig.room),
                                fileConfig.room,
                                {contents: data, stats: stats}
                            );
                        } else {
                            sails.log.error('File configuration not found for file - ' + file);
                        }
                    }
                });
            }, 100));

            next();
        }
    };
};
