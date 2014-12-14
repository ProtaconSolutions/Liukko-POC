(function() {
    'use strict';

    angular.module('liukko-poc.watcher')
        .controller('WatcherController',
            [
                '$scope', '$sailsSocket',
                '_',
                'BackendConfig', 'MessageService',
                function WatcherController(
                    $scope, $sailsSocket,
                    _,
                    BackendConfig, MessageService
                ) {
                    $sailsSocket
                        .get(BackendConfig.url + '/poc/subscribe')
                        .then(
                            function onSuccess(response) {
                                console.log(response.data.message);
                            }
                        );

                    $sailsSocket
                        .subscribe('meter', function modelEvent(message) {
                            console.log('You just got a socket message!', message);

                            MessageService.success('<pre><code>' + JSON.stringify(message) + '</code></pre>', '', {timeOut: 10000});
                        });
                }
            ]
        );
}());
