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
     * Watch method to set client to join (listen) certain room (socket channel).
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    watch: function watch(request, response) {
        // Determine asked room
        var room = request.param('room');

        // Fetch single file data from database
        sails.models['file']
            .findOne({room: room})
            .exec(function exec(error, file) {
                if (error) {
                    response.negotiate(error);
                } else if (!file) {
                    var error = new Error();

                    error.message = 'Specified file watcher not found';
                    error.status = 404;

                    response.negotiate(error);
                } else {
                    // Join to specified room
                    sails.sockets.join(request.socket, room);

                    response.ok({message: 'You have been subscribed successfully!'});
                }
            });
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

        // Fetch single file data from database
        sails.models['file']
            .findOne({room: room})
            .exec(function exec(error, file) {
                if (error) {
                    response.negotiate(error);
                } else if (!file) {
                    var error = new Error();

                    error.message = 'Specified file watcher not found';
                    error.status = 404;

                    response.negotiate(error);
                } else {
                    // Join to specified room
                    sails.sockets.leave(request.socket, room);

                    response.ok({message: 'You have been un-subscribed successfully!'});
                }
            });
    }
};
