define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('common.navBar', ['common.service'])
        .controller('navBarCtrl', navBarCtrl)
        .directive('navBar', navBar);

    navBarCtrl.$inject = ['$scope', '$location', '$cookies', '$window', 'httpService'];
    function navBarCtrl($scope, $location, $cookies, $window, httpService) {
        var vm = this,
            displayClass = 'home-nav home-nav__fixed';

        vm.collapsed = true;
        vm.toggle = toggle;
        vm.logout = logout;
        vm.displayType = displayType;
        init();

        function init() {
            setClass($location.path());
            $scope.$on('$locationChangeStart', function (e, current, prev) {
                vm.collapsed = true;
                setClass(current);
            });
        }

        function setClass(path) {
            if (path.match(/\/home/)) {
                angular.element($window).bind('scroll', function () {
                    if (document.body.scrollTop || document.documentElement.scrollTop) {
                        displayClass = 'home-nav__inverted home-nav__fixed';
                    } else {
                        displayClass = 'home-nav home-nav__fixed';
                    }
                });
                displayClass = 'home-nav home-nav__fixed';
            } else if (path.match(/\/dog/)) {
                displayClass = 'home-nav__inverted';
            } else if (path.match(/\/disclaimer/)) {
                displayClass = 'home-nav bg';
            } else {
                displayClass = 'hidden';
            }
        }

        function displayType() {
            return displayClass;
        }

        function toggle() {
            vm.collapsed = !vm.collapsed;
        }

        function logout() {
            httpService.post('/user/logout', {}).then(function () {
                $cookies.remove('demo');
                $cookies.remove('user');
                $location.path('/user');
            });
        }

    }

    function navBar() {
        return {
            restrict: 'AE',
            templateUrl: '/static/partials/navBar.html',
            controller: 'navBarCtrl',
            controllerAs: 'vm'
        }
    }
});
