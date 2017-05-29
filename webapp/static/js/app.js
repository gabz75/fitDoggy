define([
    'angular',
    'angular-route',
    'common/services/cache/Cache',
    'common/services/cache/cacheService',
    'common/services/dialog/dialog',
    'common/services/httpService',
    'common/services/pubsub',
    'modules/home/home',
    'modules/details/details',
    'modules/log/log',
    'modules/newDog/newDog'
], function (angular) {

    'use strict';

    angular.module('app', [
        'ngRoute',
        'common.cache',
        'common.cacheService',
        'common.dialog',
        'common.pubsub',
        'common.service',
        'home',
        'details',
        'log',
        'newDog'
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
            templateUrl: '/static/partials/newDog.html',
            controller: 'newDogCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog', {
            templateUrl: '/static/partials/details.html',
            controller: 'detailsCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/home'
        });

        // $locationProvider.hashPrefix('#!');

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });


    }

});

