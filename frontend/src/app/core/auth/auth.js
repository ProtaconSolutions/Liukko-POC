// Generic models angular module initialize.
(function() {
    'use strict';

    // Initialize module
    angular.module('liukko-poc.core.auth', [
        'liukko-poc.core.auth.login'
    ]);

    // Module configuration
    angular.module('liukko-poc.core.auth')
        .config(
            [
                '$stateProvider',
                function state($stateProvider) {
                    $stateProvider
                        .state('auth', {
                            parent: 'poc',
                            abstract: true
                        })
                    ;
                }
            ]
        );
}());
