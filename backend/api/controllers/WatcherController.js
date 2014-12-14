'use strict';

var _ = require('lodash');

/**
 * WatcherController
 *
 * @description :: Server-side logic for managing watcher logic
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    /**
     * Simple action to return all currently configured watcher files.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    files: function files(request, response) {
        // Determine current active rooms
        var currentRooms = sails.sockets.socketRooms(request.socket);

        // Map configured files and set some default data to those
        var files = _.map(_.clone(sails.config.watcherHook.files), function iterator(file) {
            file.watcherActive = Boolean(_.find(currentRooms, function iterator(room) {
                return room === file.room;
            }))

            file.data = '';

            return file;
        });

        response.ok(files);
    },
    /**
     * Watch method to set client to join (listen) certain room (socket channel).
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    watch: function watch(request, response) {
        // Determine asked room
        var room = request.param('room');

        console.log(JSON.stringify(sails.sockets.socketRooms(request.socket)));

        // Check that room is configured
        var found = _.find(sails.config.watcherHook.files, function iterator(file) {
            return room === file.room;
        });

        // Seems like we have valid room, so join to that room
        if (found) {
            // Join to specified room
            sails.sockets.join(request.socket, room);

            response.ok({message: 'You have been subscribed successfully!'});
        } else {
            var error = new Error();

            error.message = 'Specified file watcher not found';
            error.status = 404;

            response.negotiate(error);
        }
    },
    /**
     * Un-watch method to set client to leave certain room (socket channel).
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    unWatch: function unWatch(request, response) {
        // Determine asked room
        var room = request.param('room');

        // Check that room is configured
        var found = _.find(sails.config.watcherHook.files, function iterator(file) {
            return room === file.room;
        });

        // Seems like we have valid room, so join to that room
        if (found) {
            // Leave to specified room
            sails.sockets.leave(request.socket, room);

            console.log(JSON.stringify(sails.sockets.socketRooms(request.socket)));

            response.ok({message: 'You have been un-subscribed successfully!'});
        } else {
            var error = new Error();

            error.message = 'Specified file watcher not found';
            error.status = 404;

            response.negotiate(error);
        }
    }
};
