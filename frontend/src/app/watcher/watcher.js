(function() {
    'use strict';

    // Initialize new module
    angular.module('liukko-poc.watcher', []);

    // Module configuration
    angular.module('liukko-poc.watcher')
        .config(
            [
                '$stateProvider',
                function($stateProvider) {
                    $stateProvider
                        .state('watcher', {
                            parent: 'poc',
                            url: '/watcher',
                            data: {
                                access: 1
                            },
                            views: {
                                'content@': {
                                    templateUrl: '/liukko-poc/watcher/partials/index.html',
                                    controller: 'WatcherController',
                                    resolve: {
                                        _files: [
                                            '$sailsSocket', 'BackendConfig',
                                            function resolve($sailsSocket, BackendConfig) {
                                                return $sailsSocket
                                                    .get(BackendConfig.url + '/file')
                                                    .then(
                                                        function onSuccess(result) {
                                                            return result.data;
                                                        }
                                                    );
                                            }
                                        ]
                                    }
                                }
                            }
                        })
                    ;
                }
            ]
        );
}());
