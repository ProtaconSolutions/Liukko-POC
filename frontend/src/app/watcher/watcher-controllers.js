(function() {
    'use strict';

    angular.module('liukko-poc.watcher')
        .controller('WatcherController',
            [
                '$scope', '$sailsSocket',
                '_',
                'BackendConfig', 'MessageService',
                '_files',
                function WatcherController(
                    $scope, $sailsSocket,
                    _,
                    BackendConfig, MessageService,
                    _files
                ) {
                    $scope.files = _files;

                    $scope.watcherStart = function watcherStart(file) {
                        $sailsSocket
                            .post(BackendConfig.url + '/watcher/watch', {room: file.room})
                            .then(
                                function onSuccess(response) {
                                    file.watcherActive = true;

                                    console.log(response.data.message);

                                    MessageService.success('Watcher for file <strong>' + file.path + '</strong> is activated');
                                }
                            );

                        $sailsSocket
                            .subscribe(file.room, function modelEvent(message) {
                                console.log('You just got a socket message!', message);

                                MessageService.success('File <strong>' + file.path + '</strong> content changed.');

                                file.data = message;
                            });
                    };

                    $scope.watcherStop = function watcherStop(file) {
                        $sailsSocket
                            .post(BackendConfig.url + '/watcher/unwatch', {room: file.room})
                            .then(
                                function onSuccess(response) {
                                    file.watcherActive = false;

                                    console.log(response.data.message);

                                    MessageService.success('Watcher for file <strong>' + file.path + '</strong> is de-activated');
                                }
                            );
                    };
                }
            ]
        );
}());
