define([
    'angular',
    'lodash'
], function (angular, _) {
    'use strict';

    angular.module('common.footer', ['common.service'])
        .controller('footerMenuCtrl', footerMenuCtrl)
        .directive('footerMenu', footerMenu);

    footerMenuCtrl.$inject = ['$location', '$cookies', 'httpService'];
    function footerMenuCtrl($location, $cookies, httpService) {
        var vm = this;
        vm.logout = logout;

        function logout() {
            httpService.post('/user/logout', {}).then(function () {
                $cookies.remove('demo');
                $cookies.remove('user');
            });
        }

        function home() {
            $location.path('/home');
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