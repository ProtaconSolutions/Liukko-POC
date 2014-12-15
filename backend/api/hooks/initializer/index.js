'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');

/**
 * Initializer hook.
 *
 * This file contains a custom hook, that will be run after sails.js orm hook is loaded. Purpose of this hook is to
 * check that database contains necessary initial data for application. If database is empty hook will create some
 * basic data to it. Also note that this hook will try create actual files to fs if those doesn't exists yet.
 */
module.exports = function hook(sails) {
    return {
        /**
         * Method that runs automatically when the hook initializes itself.
         *
         * @param   {Function}  next    Callback function to call after all is done
         */
        initialize: function initialize(next) {
            var hook = this;

            // Wait for sails orm hook to be loaded
            sails.after('hook:orm:loaded', function onAfter() {
                hook._checkDatabase(next);
            });
        },

        /**
         * Private hook method to do actual database data population.
         *
         * @param   {Function}  next    Callback function to call after all is done
         * @private
         */
        _checkDatabase: function _checkDatabase(next) {
            var hook = this;

            sails.models['file']
                .find()
                .exec(function onExec(error, files) {
                    if (error) {
                        next(error);
                    } else if (files.length !== 0) {
                        next();
                    } else {
                        hook._populateDatabase(next);
                    }
                });
        },

        /**
         * Private hook function to write actual example data to database.
         *
         * @param   {Function}  next    Callback function to call after all is done
         * @private
         */
        _populateDatabase: function _populateDatabase(next) {
            var hook = this;

            var dataPath = path.resolve(sails.config.appPath, 'data');

            // Default data
            var data = [
                {
                    name: '/proc/uptime',
                    description: 'Watcher for \'/proc/uptime\' file to demonstrate automatic updates with some *nix default behaviour.',
                    path: '/proc/uptime',
                    room: 'uptime',
                    editable: false
                },
                {
                    name: 'textfile1.txt',
                    description: 'Example watcher file',
                    path: dataPath + '/textfile1.txt',
                    room: 'watcher_01',
                    editable: true
                },
                {
                    name: 'textfile2.txt',
                    description: 'Example watcher file',
                    path: dataPath + '/textfile2.txt',
                    room: 'watcher_02',
                    editable: true
                },
                {
                    name: 'textfile3.txt',
                    description: 'Example watcher file',
                    path: dataPath + '/textfile3.txt',
                    room: 'watcher_03',
                    editable: true
                }
            ];

            // Create new rows to database
            sails.models['file']
                .create(data)
                .exec(function(error, results) {
                    if (error) {
                        next(error);
                    } else {
                        hook._createFiles(results, next);
                    }
                });
        },

        /**
         * Private helper function to create files to fs.
         *
         * @param   {Array}     files   Array of files to check if those exists
         * @param   {Function}  next    Callback function to call after all is done
         * @private
         */
        _createFiles: function _createFiles(files, next) {
            async.each(
                files,
                function iterator(file, callback) {
                    fs.exists(file.path, function(exists) {
                        if (exists) {
                            callback();
                        } else {
                            fs.writeFile(file.path, file.description, callback);
                        }
                    })
                },
                function allDone(error) {
                    next(error);
                }
            )
        }
    }
};