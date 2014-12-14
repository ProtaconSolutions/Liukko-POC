/**
 * Angular module for 'core' component. This component is divided to following logical components:
 *
 *  liukko-poc.core.auth
 *  liukko-poc.core.components
 *  liukko-poc.core.directives
 *  liukko-poc.core.error
 *  liukko-poc.core.interceptors
 *  liukko-poc.core.layout
 *  liukko-poc.core.libraries
 *  liukko-poc.core.services
 *
 * Each component has it own configuration for ui-router.
 */
(function() {
    'use strict';

    // Define liukko-poc.core module
    angular.module('liukko-poc.core', [
        'liukko-poc.core.auth',
        'liukko-poc.core.components',
        'liukko-poc.core.directives',
        'liukko-poc.core.error',
        'liukko-poc.core.interceptors',
        'liukko-poc.core.layout',
        'liukko-poc.core.libraries',
        'liukko-poc.core.services'
    ]);
}());
