(function() {
    'use strict';

    angular.module('liukko-poc.watcher')
        .controller('WatcherController',
            [
                '$scope', '$sailsSocket', '$modal',
                '_',
                'BackendConfig', 'MessageService',
                '_files',
                function WatcherController(
                    $scope, $sailsSocket, $modal,
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
                        var modalInstance = $modal.open({
                            templateUrl: '/liukko-poc/watcher/partials/modal.html',
                            controller: 'ModalController',
                            size: 'lg',
                            resolve: {
                                _file: function resolve() {
                                    return true;
                                }
                            }
                        });

                        modalInstance.result
                            .then(
                                function onSuccess() {
                                    console.log('modal close');
                                },
                                function onDismiss() {
                                    console.log('modal dismiss');
                                }
                            );
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

                                    file.data = message;
                                });
                        }
                    };
                }
            ]
        );

    angular.module('liukko-poc.watcher')
        .controller('ModalController',
            [
                '$scope', '$modalInstance',
                function ModalController(
                    $scope, $modalInstance
                ) {
                    $scope.save = function save() {
                        $modalInstance.close();
                    };

                    $scope.cancel = function cancel() {
                        $modalInstance.dismiss();
                    };
                }
            ]
        );
}());
