define([
    'angular',
    'lodash'
], function (angular, _) {
    'use strict';

    angular.module('common.footer', ['common.service', 'common.breadcrumb'])
        .controller('footerMenuCtrl', footerMenuCtrl)
        .directive('footerMenu', footerMenu);

    footerMenuCtrl.$inject = ['$rootScope', '$location', '$cookies', '$timeout', 'httpService', 'breadcrumb'];
    function footerMenuCtrl($rootScope, $location, $cookies, $timeout, httpService, breadcrumb) {
        var vm = this;
        vm.logout = logout;
        vm.home = home;
        vm.showFullMenu = showFullMenu;
        vm.hideFullMenu = hideFullMenu;

        init();

        function init() {
            vm.loggedIn = $cookies.getObject('user') || $cookies.getObject('demo');
            vm.previous = breadcrumb.getPrevious();

            $rootScope.$on('$locationChangeSuccess', function () {
                vm.loggedIn = $cookies.getObject('user') || $cookies.getObject('demo');
                vm.previous = breadcrumb.getPrevious();
            });
        }

        function logout() {
            httpService.post('/user/logout', {}).then(function () {
                $cookies.remove('demo');
                $cookies.remove('user');
            });
        }

        function home() {
            $location.path('/home');
        }

        function showFullMenu() {
            vm.expanded = true;
            $timeout(function () {
                vm.fullMenu = true;
            }, 300);
        }

        function hideFullMenu() {
            $timeout(function () {
                vm.fullMenu = false;
                vm.expanded = false;
            }, 350);
        }
    }

    function footerMenu() {
        return {
            restrict: 'AE',
            templateUrl: '/static/partials/footerMenu.html',
            controller: 'footerMenuCtrl',
            controllerAs: 'vm'
        }
    }
});
