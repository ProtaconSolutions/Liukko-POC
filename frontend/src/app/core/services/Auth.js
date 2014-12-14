/**
 * Auth service which is used to authenticate users with backend server and provide simple methods to check if user is
 * authenticated or not.
 *
 * Within successfully login process service will store user data and JWT token to local storage where those are
 * accessible in the application.
 *
 * This service provides following methods:
 *  Auth.authorize(access)
 *  Auth.isAuthenticated()
 *  Auth.login(credentials)
 *  Auth.logout()
 *
 * You can use this service fairly easy on your controllers and views if you like to. It's recommend that you use this
 * service with 'User' service in your controllers and views.
 *
 * Usage example in controller:
 *
 *  angular
 *      .module('app')
 *      .controller('SomeController',
 *          [
 *              '$scope', 'Auth', 'User',
 *              function ($scope, Auth, CurrentUser) {
 *                  $scope.auth = Auth;
 *                  $scope.user = User;
 *              }
 *          ]
 *      );
 *
 * Usage example in view:
 *
 *  <div data-ng-show="auth.isAuthenticated()">
 *      Hello, <strong>{{user.email}}</strong>
 *  </div>
 *
 * Happy coding!
 *
 * @todo    Revoke method?
 * @todo    Text localizations?
 */
(function() {
    'use strict';

    angular.module('liukko-poc.core.services')
        .factory('Auth',
            [
                '$http', '$state', '$localStorage',
                'BackendConfig', 'MessageService',
                function(
                    $http, $state, $localStorage,
                    BackendConfig, MessageService
                ) {
                    return {
                        /**
                         * Method to authorize current user with given access level in application. Possible access
                         * levels are:
                         *  0 = Anonymous, all users can access
                         *  1 = User, only logged on users can access
                         *  2 = Admin, only admin level users can access
                         *
                         * @param   {Number}    accessLevel Access level to check
                         *
                         * @returns {Boolean}
                         */
                        authorize: function authorize(accessLevel) {
                            if (accessLevel === 1) {
                                return this.isAuthenticated();
                            } else if (accessLevel === 2) {
                                return this.isAuthenticated() && Boolean($localStorage.user.admin);
                            } else {
                                return accessLevel === 0;
                            }
                        },

                        /**
                         * Method to check if current user is authenticated or not. This will just
                         * simply call 'Storage' service 'get' method and returns it results.
                         *
                         * @returns {Boolean}
                         */
                        isAuthenticated: function isAuthenticated() {
                            return Boolean($localStorage.user);
                        },

                        /**
                         * Method make login request to backend server. Successfully response from
                         * server contains user data and JWT token as in JSON object. After successful
                         * authentication method will store user data and JWT token to local storage
                         * where those can be used.
                         *
                         * @param   {{}}    credentials
                         *
                         * @returns {*|Promise}
                         */
                        login: function login(credentials) {
                            return $http
                                .post(BackendConfig.url + '/login', credentials, {withCredentials: true})
                                .then(
                                    function onSuccess(response) {
                                        MessageService.success('You have been logged in.');

                                        // Store user and token data
                                        $localStorage.user = response.data.user;
                                        $localStorage.token = response.data.token;
                                    }
                                );
                        },

                        /**
                         * The backend doesn't care about actual user logout, just delete the token
                         * and you're good to go.
                         *
                         * Question still: Should we make logout process to backend side?
                         */
                        logout: function logout() {
                            MessageService.success('You have been logged out.');

                            // Remove user and token data from local storage
                            delete $localStorage.user;
                            delete $localStorage.token;

                            $state.go('auth.login');
                        }
                    };
                }
            ]
        );
}());
