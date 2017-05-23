define([
    'angular',
    'angular-route',
    'common/services/pubsub',
    'common/services/cache',
    'common/services/httpService',
    'common/services/dialog',
    'modules/home/home',
    'modules/details/details',
    'modules/log/log',
    'modules/edit/edit'
], function (angular) {

    'use strict';

    angular.module('app', [
        'ngRoute',
        'common.cache',
        'common.dialog',
        'common.pubsub',
        'common.service',
        'home',
        'details',
        'log'
    ])
        .config(appConfig);

    appConfig.$inject = ['$routeProvider'];
    function appConfig($routeProvider) {
        $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: 'static/partials/home.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog/date/:date', {
            templateUrl: 'static/partials/log.html',
            controller: 'logCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog/edit', {
            templateUrl: 'static/partials/edit.html',
            controller: 'editCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/new', {
            templateUrl: 'static/partials/new.html',
            controller: 'editCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog', {
            templateUrl: 'static/partials/details.html',
            controller: 'detailsCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/home'
        });

    }

});

