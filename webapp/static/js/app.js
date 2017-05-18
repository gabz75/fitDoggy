define([
    'angular',
    'uiRouter',
    'modules/home/home'
], function (angular) {

    'use strict';

    angular.module('app', [
        'home',
        'ui.router'
    ])
        .config(appConfig);

    appConfig.$inject = ['$stateProvider'];
    function appConfig($stateProvider) {
        $stateProvider
        .state('dogApp', {
            url: '/',
            templateUrl: 'index.html',
            redirectTo: 'dogApp.home'
        })
        .state('dogApp.home', {
            url: '/home',
            templateUrl: '../../templates/home.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        });

    }
});
