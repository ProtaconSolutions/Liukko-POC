'use strict';

/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auth controller logic
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 * @todo
 *  1)  What is the "real" authentication to use here?
 *  2)  What information tablet is actually sending for this?
 *  3)  What response tablet will need besides JWT value?
 *  4)  Do we need to invalidate JWT after n seconds?
 *  5)  What else?
 */
module.exports = {
    /**
     * Simple login method.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    login: function login(request, response) {
        var username = request.param('username');
        var password = request.param('password');

        // Now we're just using some "static" credentials here
        if (username === 'liukko' && password === 'poc') {
            // Used JWT payload
            var payload = {
                tabletId: 1234,
                issuedAt: new Date()
            };

            // Actual response data
            var data = {
                user: {
                    username: 'liukko',
                    tableId: 1234
                },
                token: sails.services['token'].issue(JSON.stringify(payload))
            };

            response.json(200, data);
        } else {
            sails.log.verbose('User authentication failed');

            response.json(401, {message: 'Invalid credentials.'});
        }
    },
    /**
     * Simple logout method.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    logout: function logout(request, response) {
        response.json(200);
    }
};
