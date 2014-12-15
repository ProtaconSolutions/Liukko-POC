'use strict';

/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    schema: true,
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        description: {
            type: 'text',
            required: true
        },
        path: {
            type: 'text',
            required: true,
            unique: true
        },
        room: {
            type: 'string',
            required: true,
            unique: true
        },
        editable: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
