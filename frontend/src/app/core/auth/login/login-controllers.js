/**
 * This file contains all necessary Angular controller definitions for 'liukko-poc.core.auth.login' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
    'use strict';

    /**
     * Login controller to handle user's login to application. Controller uses 'Auth' service to make actual HTTP
     * request to server and try to authenticate user.
     *
     * After successfully login Auth service will store user data and JWT token to User service where those are asked
     * whenever needed in application.
     */
    angular.module('liukko-poc.core.auth.login')
        .controller('LoginController',
            [
                '$scope', '$state',
                'Auth', 'FocusOnService',
                function LoginController(
                    $scope, $state,
                    Auth, FocusOnService
                ) {
                    // Already authenticated so redirect back to books list
                    if (Auth.isAuthenticated()) {
                        $state.go('watcher');
                    }

                    // Scope function to perform actual login request to server
                    $scope.login = function login() {
                        Auth
                            .login($scope.credentials)
                            .then(
                                function successCallback() {
                                    $state.go('watcher');
                                },
                                function errorCallback() {
                                    _reset();
                                }
                            );
                    };

                    /**
                     * Private helper function to reset credentials and set focus to username input.
                     *
                     * @private
                     */
                    function _reset() {
                        FocusOnService.focus('username');

                        // Initialize credentials
                        $scope.credentials = {
                            username: '',
                            password: ''
                        };
                    }

                    _reset();
                }
            ]
        );
}());
