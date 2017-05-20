define([
    'angular',
    'ngRoute',
    'common/services/pubsub',
    'common/services/cache',
    'modules/home/home',
    'modules/details/details',
    'modules/edit/edit'
], function (angular) {

    'use strict';

    angular.module('app', [
        'ngRoute',
        'common.pubsub',
        'common.cache',
        'home',
        'details'
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
            templateUrl: 'static/partials/details.html',
            controller: 'detailsCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/:dog/edit', {
            templateUrl: 'static/partials/edit.html',
            controller: 'editCtrl',
            controllerAs: 'vm'
        })
        .when('/dog/new', {
            templateUrl: 'static/partials/addNew.html',
            controller: 'editCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/home'
        });

    }

});

