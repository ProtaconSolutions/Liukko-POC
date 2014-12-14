'use strict';

var path = require('path');
var chokidar = require('chokidar');
var fs = require('fs');

module.exports = function (sails) {
    return {
        /**
         * Default configuration
         *
         * We do this in a function since the configuration key for the hook is itself configurable, so we can't just
         * return an object.
         */
        defaults: function defaults() {
            // Create an object to hold default configuration
            var config = {};

            /**
             * Set default configuration under the configKey for this hook, which defaults to "poc" but is
             * user-configurable by setting sails.config.hooks['sails-hook-poc'].configKey
             *
             * @type    {{
             *              files: array
             *          }}
             */
            //
            config[this.configKey] = {
                files: [
                    path.resolve(sails.config.appPath, 'data') + '/poc.txt'
                ]
            };

            /**
             * Return the default configuration, which will be merged into the Sails config if not overridden by the
             * user.
             */
            return config;
        },

        /**
         * Initialize the hook
         *
         * @param  {Function}   next    Callback for when we're done initializing
         */
        initialize: function initialize(next) {
            // If the hook has been deactivated, just return
            if (sails.config[this.configKey].files.length === 0) {
                sails.log.verbose("POC file listener hook deactivated. No files configured at this moment...");

                return next();
            }

            // Watch all specified files
            var watcher = chokidar.watch(sails.config[this.configKey].files, {
                // Ignore the initial "add" events which are generated when Chokidar starts watching files
                ignoreInitial: true,
                persistent: true
            });


            /**
             * Whenever something changes on those specified files. Debounce the event handler so that in only fires
             * after receiving all of the change events.
             */
            watcher.on('change', sails.util.debounce(function debounce(path, stats) {
                sails.log.verbose('Detected POC file change -- ' + path);

                // Read changed file contents
                fs.readFile(path, 'utf8', function callback(error, data) {
                    if (error) {
                        sails.log.error('File read error on POC hook - ' + path);
                        sails.log.error(error);
                    } else {
                        sails.log.verbose('File changed content is now:');
                        sails.log.verbose(data);

                        // Blast socket event to all subscribers
                        sails.sockets.blast('meter', {data: data, stats: stats});
                    }
                });
            }, 100));

            // We're done initializing.
            return next();
        }
    };
};
