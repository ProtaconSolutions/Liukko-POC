'use strict';

var path = require('path');
var sails = require('sails');

/**
 * Local environment settings
 *
 * While you're DEVELOPING your app, this config file should include
 * any settings specifically for your development computer (db passwords, etc.)
 *
 * When you're ready to deploy your app in PRODUCTION, you can always use this file
 * for configuration options specific to the server where the app will be deployed.
 * But environment variables are usually the best way to handle production settings.
 *
 * PLEASE NOTE:
 *      This file is included in your .gitignore, so if you're using git
 *      as a version control solution for your Sails app, keep in mind that
 *      this file won't be committed to your repository!
 *
 *      Good news is, that means you can specify configuration for your local
 *      machine in this file without inadvertently committing personal information
 *      (like database passwords) to the repo.  Plus, this prevents other members
 *      of your team from committing their local configuration changes on top of yours.
 *
 * For more information, check out:
 * http://links.sailsjs.org/docs/config/local
 */
module.exports = {
    watcherHook: {
        files: [
            {
                path: path.resolve(sails.config.appPath, 'data') + '/file_01.txt',
                name: 'File watcher 1',
                room: 'watcher_01'
            },
            {
                path: path.resolve(sails.config.appPath, 'data') + '/file_02.txt',
                name: 'File watcher 2',
                room: 'watcher_02'
            },
            {
                path: path.resolve(sails.config.appPath, 'data') + '/file_03.txt',
                name: 'File watcher 3',
                room: 'watcher_03'
            },
            {
                path: path.resolve(sails.config.appPath, 'data') + '/file_04.txt',
                name: 'File watcher 4',
                room: 'watcher_04'
            }
        ]
    },
    port: 1337,
    environment: 'development',
    log: {
        level: 'info'
    }
};
