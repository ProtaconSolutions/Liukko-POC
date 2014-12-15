'use strict';

var _ = require('lodash');
var fs = require('fs');

/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {
    /**
     * Controller method to read specified file contents from fs.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    read: function read(request, response) {
        var fileId = request.param('id');

        sails.models['file']
            .findOne(fileId)
            .exec(function exec(error, file) {
                if (error) {
                    response.negotiate(error);
                } else if (!file) {
                    var error = new Error();

                    error.message = 'Specified file not found';
                    error.status = 404;

                    response.negotiate(error);
                } else {
                    fs.readFile(file.path, 'utf8', function callback(error, data) {
                        if (error) {
                            response.negotiate(error);
                        } else {
                            file.data = data;

                            response.ok(file);
                        }
                    });
                }
            })
    },

    /**
     * Controller method to write specified file contents to fs.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    write: function write(request, response) {
        var fileId = request.param('id');

        sails.models['file']
            .findOne(fileId)
            .exec(function exec(error, file) {
                if (error) {
                    response.negotiate(error);
                } else if (!file) {
                    var error = new Error();

                    error.message = 'Specified file not found';
                    error.status = 404;

                    response.negotiate(error);
                } else {
                    fs.writeFile(file.path, request.param('data'), function callback(error, data) {
                        if (error) {
                            response.negotiate(error);
                        } else {
                            file.data = request.param('data');

                            response.ok(file);
                        }
                    });
                }
            })
    }
});
