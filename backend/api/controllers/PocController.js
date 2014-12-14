'use strict';

/**
 * PocController
 *
 * @description :: Server-side logic for managing pocs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 * @todo
 *  1)  Make socket request check to be a policy
 *  2)  Add support to join "specified" rooms (maybe some meter model and here request.param('meter') handling)
 *  3)  What else we need here?
 */
module.exports = {
    /**
     * Subscribe method to set client to join (listen) certain room (socket channel).
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    subscribe: function subscribe(request, response) {
        if (!request.isSocket) {
            return response.negotiate(406);
        }

        // Join to specified room
        sails.sockets.join(request.socket, 'meter');

        response.ok({message: 'You have been subscribed successfully!'});
    },
    /**
     * Un-subscribe method to set client to leave certain room (socket channel).
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    unSubscribe: function unSubscribe(request, response) {
        if (!request.isSocket) {
            return response.negotiate(406);
        }

        // Join to specified room
        sails.sockets.leave(request.socket, 'meter');

        response.ok({message: 'You have been un-subscribed successfully!'})
    }
};
