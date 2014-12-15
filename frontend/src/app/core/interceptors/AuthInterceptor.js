/**
 * Auth interceptor for HTTP and Socket request. This interceptor will add required
 * JWT (Json Web Token) token to each requests. That token is validated in server side
 * application.
 *
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-introduction/
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-examples/
 */
(function() {
    'use strict';

    angular.module('liukko-poc.core.interceptors')
        .factory('AuthInterceptor',
            [
                '$q', '$localStorage',
                function(
                    $q, $localStorage
                ) {
                    return {
                        /**
                         * Interceptor method for $http requests. Main purpose of this method is to add JWT token
                         * to every request that application does.
                         *
                         * @param   {*} config  HTTP request configuration
                         *
                         * @returns {*}
                         */
                        request: function requestCallback(config) {
                            var token = $localStorage.token;

                            if (!config.data) {
                                config.data = {};
                            }

                            // Set token to header + payload
                            config.data.token = token;
                            config.headers.authorization = 'Bearer ' + token;
                            config.timeout = 5;

                            return config;
                        },

                        /**
                         * Interceptor method that is triggered whenever response error occurs on $http requests.
                         *
                         * @param   {*} response
                         *
                         * @returns {Promise}
                         */
                        responseError: function responseErrorCallback(response) {
                            return $q.reject(response);
                        }
                    };
                }
            ]
        );
}());
