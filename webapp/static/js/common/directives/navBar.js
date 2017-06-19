define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('common.navBar', ['common.service'])
        .controller('navBarCtrl', navBarCtrl)
        .directive('navBar', navBar);

    navBarCtrl.$inject = ['$scope', '$location', '$cookies', 'httpService'];
    function navBarCtrl($scope, $location, $cookies, httpService) {
        var vm = this;

        vm.collapsed = true;
        vm.displayType = displayType;
        vm.toggle = toggle;
        vm.logout = logout;

        init();

        function init() {
            $scope.$on('$locationChangeSuccess', function () {
                vm.collapsed = true;
            });
        }

        function displayType() {
            var path = $location.path();
            if (path.match(/\/home/)) {
                return 'home-nav';
            } else if (path.match(/\/dog/)) {
                return 'home-nav__fixed';
            } else if (path.match(/\/disclaimer/)) {
                return 'home-nav bg';
            } else {
                return 'hidden';
            }
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
