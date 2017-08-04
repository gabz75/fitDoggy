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
    'common/factories/notification',
    'common/directives/navBar',
    'common/directives/sideBar',
    'modules/home/home',
    'modules/calendar/calendar',
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
        'common.navBar',
        'common.notification',
        'common.service',
        'common.sideBar',
        'common.upload',
        'calendar',
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
            redirectTo: '/home'
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
        .when('/disclaimer', {
            templateUrl: '/static/partials/disclaimer.html'
        })
        .when('/dog/:dog/calendar', {
            templateUrl: '/static/partials/calendar.html',
            controller: 'calendarCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/home'
        });
    }
    runApp.$inject = ['$rootScope', '$location', '$cookies', '$http', '$q'];
    function runApp($rootScope, $location, $cookies, $http, $q) {
        var images = [],
            thumbnails = [],
            loggedIn,
            init;
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var path = $location.path(),
                restricted = path !== '/user',
                selected = path.match(/\/dog\/(\d+)/);
            loggedIn = $cookies.get('user') || $cookies.get('demo');
            if (restricted && !loggedIn) {
                $location.path('/user');
                init = false;
                return;
            }
            if (loggedIn && !init) {
                initUser();
            }
            if (selected && selected.length > 1) {
                selectDog();
            } else {
                $rootScope.selectedDog = void 0;   
            }
        });

        function initUser() {
            $rootScope.dogs = $http.post('/dog/all', {});
            $http.post('/dog/images', {}).then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    var full = new Image(),
                        thumbnail = new Image();
                    full.src = response[i].url;
                    thumbnail.src = response[i].thumbnailUrl;
                    images.push(full);
                    thumbnails.push(thumbnail);
                }
            });
            init = true;
        }

        function selectDog() {
            var dog = $location.path().match(/\/dog\/(\d+)/);
            if (dog && dog.length > 1 && dog[1]) {
                if (!$rootScope.selectedDog || $rootScope.selectedDog.id !== dog[1]){
                    $q.when($rootScope.dogs).then(function (response) {
                        $rootScope.selectedDog = _.find(response.data, function (data) {
                            return data.id === dog[1];
                        });
                        var cookieExp = new Date();
                        cookieExp.setDate(cookieExp.getDate() + 7);
                        $cookies.putObject('dog', $rootScope.selectedDog, {expires: cookieExp});
                    });
                }
            } else {
                $rootScope.selectedDog = $cookies.get('dog');
            }
        }
        $rootScope.$on('$destroy', function () {
            $cookies.remove('demo');
        });
    }
});

