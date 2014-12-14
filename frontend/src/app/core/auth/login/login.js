/**
 * Initialize of core.auth.login component which is divided to following logical components:
 *
 *  Controllers
 *
 * All of these are wrapped to 'liukko-poc.core.auth.login' angular module.
 */
(function() {
    'use strict';

    // Define liukko-poc.core.auth.login angular module
    angular.module('liukko-poc.core.auth.login', []);

    // Module configuration
    angular.module('liukko-poc.core.auth.login')
        .config(
            [
                '$stateProvider',
                function($stateProvider) {
                    $stateProvider
                        .state('auth.login', {
                            url: '/login',
                            data: {
                                access: 0
                            },
                            views: {
                                'content@': {
                                    templateUrl: '/liukko-poc/core/auth/login/partials/login.html',
                                    controller: 'LoginController'
                                }
                            }
                        })
                    ;
                }
            ]
        );
}());