/**
 * This file contains all necessary Angular controller definitions for 'liukko-poc.core.layout' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
    'use strict';

    /**
     * Generic header controller for application layout. this contains all necessary logic which is used on application
     * header section. Basically this contains following:
     *
     *  1) Main navigation
     *  2) Login / Logout
     */
    angular.module('liukko-poc.core.layout')
        .controller('HeaderController',
            [
                '$scope', '$state', '$localStorage',
                'User', 'Auth',
                function controller(
                    $scope, $state, $localStorage,
                    User, Auth
                ) {
                    $scope.user = User;
                    $scope.auth = Auth;

                    // Simple helper function which triggers user logout action.
                    $scope.logout = function logout() {
                        Auth.logout();
                    };

                    /**
                     * Watcher for user that is stored to local storage. This is needed to update user info to layout
                     * right after login.
                     */
                    $scope.$watch(function watcher() {
                        return angular.toJson($localStorage);
                    }, function() {
                        $scope.user = $localStorage.user;
                    });
                }
            ]
        );

    /**
     * Generic footer controller for application layout. This contains all necessary logic which is used on application
     * footer section. Basically this contains following:
     *
     *  1) Generic links
     *  2) Version info parsing (back- and frontend)
     */
    angular.module('liukko-poc.core.layout')
        .controller('FooterController',
            [
                function controller() {
                    // TODO: add version info parsing
                }
            ]
        );
}());
