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
                    $scope.rooms = [];

                    /**
                     * Scope function to start watcher for specified file. This will make a request to backend and
                     * there make actual "join" action to specified room.
                     *
                     * Also this function contains logic for actual socket message handling for specified socket room.
                     *
                     * @param   {{}}    file
                     */
                    $scope.watcherStart = function watcherStart(file) {
                        // Make request to backend for "joining" to certain room
                        $sailsSocket
                            .post(BackendConfig.url + '/watcher/watch', {room: file.room})
                            .then(
                                function onSuccess() {
                                    file.watcherActive = true;

                                    _startListenMessages(file);

                                    MessageService.success('Watcher for file <strong>' + file.path + '</strong> is activated');
                                }
                            );
                    };

                    /**
                     * Scope function to stop watcher for specified file. This will make a request to backend and make
                     * current client / user leave specified room.
                     *
                     * @param   {{}}    file
                     */
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

                    /**
                     * Scope function to update specified file contents.
                     *
                     * @param   {{}}    file
                     */
                    $scope.updateFileContent = function updateFileContent(file) {
                        MessageService.info('File ' + file.path + ' content update is not yet supported');
                    };

                    /**
                     * Private helper function to start handling socket messages. Note that this function will check if
                     * room is already set to subscribed or not. This will prevent duplicate events.
                     *
                     * @param   {{}}    file
                     * @private
                     */
                    var _startListenMessages = function _startListenMessages(file) {
                        if ($scope.rooms.indexOf(file.room) === -1) {
                            $scope.rooms.push(file.room);

                            $sailsSocket
                                .subscribe(file.room, function modelEvent(message) {
                                    console.log('You just got a socket message!', message);

                                    MessageService.success('File <strong>' + file.path + '</strong> content changed.');

                                    file.data = message;
                                });
                        }
                    };
                }
            ]
        );
}());
