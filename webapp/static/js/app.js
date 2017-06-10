define([
    'angular',
    'lodash',
    'angular-route',
    'angular-cookies',
    'common/services/cache/Cache',
    'common/services/cache/cacheService',
    'common/services/dialog/dialog',
    'common/services/httpService',
    'common/factories/upload',
    'common/directives/footerMenu',
    'modules/home/home',
    'modules/details/details',
    'modules/log/log',
    'modules/updateDog/updateDog',
    'modules/user/user'
], function (angular, _) {

    'use strict';

    angular.module('app', [
        'ngRoute',
        'ngCookies',
        'common.cache',
        'common.cacheService',
        'common.dialog',
        'common.footer',
        'common.service',
        'common.upload',
        'details',
        'home',
        'log',
        'updateDog',
        'user'
    ])
        .config(appConfig)
        .run(runApp);

    appConfig.$inject = ['$routeProvider', '$locationProvider'];
    function appConfig($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            redirectTo: '/user'
        })
        .when('/user', {
            templateUrl: '/static/partials/login.html',
            controller: 'userCtrl',
            controllerAs: 'vm'
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
            redirectTo: '/user'
        });
    }
    runApp.$inject = ['$rootScope', '$location', '$cookies'];
    function runApp($rootScope, $location, $cookies) {
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var restricted = '$location.path()' !== '/user',
                loggedIn = $cookies.getObject('user') || $cookies.getObject('demo');
            if (restricted && !loggedIn) {
                $location.path('/user');
            }
        });
        $rootScope.$on('$destroy', function () {
            $cookies.remove('demo');
            
        });
    }
});

