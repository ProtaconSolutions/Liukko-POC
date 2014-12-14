/**
 * Generic user service within this you can access to currently signed in user data. Note that if you wanna be secure
 * about this you have to also use 'Auth' service in your views.
 *
 * Usage example in controller:
 *  angular
 *      .module('app')
 *      .controller('SomeController',
 *          [
 *              '$scope', 'Auth', 'User',
 *              function ($scope, Auth, User) {
 *                  $scope.auth = Auth;
 *                  $scope.user = User;
 *              }
 *          ]
 *      );
 *
 * Usage example in view:
 *  <div data-ng-show="auth.isAuthenticated()">
 *      Hello, <strong>{{user.email}}</strong>
 *  </div>
 *
 * Happy coding!
 */
(function() {
    'use strict';

    angular.module('liukko-poc.core.services')
        .factory('User',
            [
                '$localStorage',
                function service($localStorage) {
                    $localStorage.$default({
                        user: false
                    });

                    return $localStorage.user;
                }
            ]
        );
}());