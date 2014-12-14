/**
 * Application core constant definitions.
 *
 * Note that 'BackendConfig.url' is configured in /frontend/config/config.json file and you _must_ change it to match
 * your backend API url.
 */
(function() {
    'use strict';

    angular.module('liukko-poc')
        .constant('BackendConfig', {
            url: window.io.sails.url
        });
}());
