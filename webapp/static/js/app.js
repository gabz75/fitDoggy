define([
    'angular',
    'angular-route',
    'common/services/cache/Cache',
    'common/services/cache/cacheService',
    'common/services/dialog/dialog',
    'common/services/httpService',
    'common/factories/upload',
    'modules/home/home',
    'modules/details/details',
    'modules/log/log',
    'modules/updateDog/updateDog'
], function (angular) {

    'use strict';

    angular.module('app', [
        'ngRoute',
        'common.cache',
        'common.cacheService',
        'common.dialog',
        'common.service',
        'common.upload',
        'home',
        'details',
        'log',
        'updateDog'
    ])
        .config(appConfig);

    appConfig.$inject = ['$routeProvider', '$locationProvider'];
    function appConfig($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: '/static/partials/home.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog/date/:date', {
            templateUrl: '/static/partials/log.html',
            controller: 'logCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/new', {
            templateUrl: '/static/partials/updateDog.html',
            controller: 'updateDogCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog', {
            templateUrl: '/static/partials/details.html',
            controller: 'detailsCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog/update', {
            templateUrl: '/static/partials/updateDog.html',
            controller: 'updateDogCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/home'
        });
    }

});

