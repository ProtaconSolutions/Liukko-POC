// Main application definition for liukko-poc frontend side.
(function() {
    'use strict';

    // Create liukko-poc module and specify dependencies for that
    angular.module('liukko-poc', [
        'angular-loading-bar',
        'ngStorage',
        'ui.router',
        'toastr',
        'sails.io',
        'liukko-poc-templates',
        'liukko-poc.core',
        'liukko-poc.watcher'
    ]);

    /**
     * Configuration for liukko-poc application, this contains following main sections:
     *
     *  1) Configure $httpProvider and $sailsSocketProvider
     *  2) Set necessary HTTP and Socket interceptor(s)
     *  3) Turn on HTML5 mode on application routes
     *  4) Set up application base route
     */
    angular.module('liukko-poc')
        .config(
            [
                '$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$sailsSocketProvider',
                'cfpLoadingBarProvider',
                'toastrConfig',
                function config(
                    $stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $sailsSocketProvider,
                    cfpLoadingBarProvider,
                    toastrConfig
                ) {
                    // Add interceptors for $httpProvider and $sailsSocketProvider
                    $httpProvider.interceptors.push('AuthInterceptor');
                    $httpProvider.interceptors.push('ErrorInterceptor');
                    $sailsSocketProvider.interceptors.push('AuthInterceptor');
                    $sailsSocketProvider.interceptors.push('ErrorInterceptor');
                    $sailsSocketProvider.interceptors.push('LoaderInterceptor');

                    // Disable spinner from cfpLoadingBar
                    cfpLoadingBarProvider.includeSpinner = false;

                    // Extend default toastr configuration with application specified configuration
                    angular.extend(
                        toastrConfig,
                        {
                            allowHtml: true,
                            closeButton: true,
                            extendedTimeOut: 3000
                        }
                    );

                    // Yeah we wanna to use HTML5 urls!
                    $locationProvider
                        .html5Mode(true)
                        .hashPrefix('!')
                    ;

                    // Main state provider for liukko-poc application
                    $stateProvider
                        .state('poc', {
                            abstract: true,
                            data: {
                                access: 1
                            },
                            views: {
                                header: {
                                    templateUrl: '/liukko-poc/core/layout/partials/header.html',
                                    controller: 'HeaderController'
                                },
                                footer: {
                                    templateUrl: '/liukko-poc/core/layout/partials/footer.html',
                                    controller: 'FooterController'
                                }
                            }
                        })
                    ;

                    // For any unmatched url, redirect to /login
                    $urlRouterProvider.otherwise('/login');
                }
            ]
        );

    // liukko-poc application run hook configuration.
    angular.module('liukko-poc')
        .run(
            [
                '$rootScope', '$state', '$injector',
                function run(
                    $rootScope, $state, $injector
                ) {
                    // Check auth status on state change
                    $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState) {
                        if (!$injector.get('Auth').authorize(toState.data.access)) {
                            event.preventDefault();

                            $state.go('auth.login');
                        }
                    });

                    // Check for state change errors.
                    $rootScope.$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
                        event.preventDefault();

                        $injector.get('MessageService')
                            .error('Error loading the page');

                        $state.get('error').error = {
                            event: event,
                            toState: toState,
                            toParams: toParams,
                            fromState: fromState,
                            fromParams: fromParams,
                            error: error
                        };

                        return $state.go('error');
                    });
                }
            ]
        );
}());
