/**
 * Generic models angular module initialize.
 */
(function() {
    'use strict';

    angular.module('liukko-poc.core.error', []);

    // Module configuration
    angular.module('liukko-poc.core.error')
        .config(
            [
                '$stateProvider',
                function state($stateProvider) {
                    $stateProvider
                        .state('error', {
                            parent: 'liukko-poc',
                            url: '/error',
                            views: {
                                'content@': {
                                    templateUrl: '/liukko-poc/core/error/partials/error.html',
                                    controller: 'ErrorController',
                                    resolve: {
                                        _error: function resolve() {
                                                return this.self.error;
                                            }

                                    }
                                }
                            }
                        })
                    ;
                }
            ]
        );
}());
