define([
    'angular',
    'moment',
    'lodash'
], function (angular, moment, lodash) {
    'use strict';

    angular.module('user.controller', ['user.service'])
        .controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$location', 'userService'];
    function userCtrl($location, userService) {
        var vm = this,
            currentView = 'login';

        vm.user = {};
        vm.activeView = activeView;
        vm.setView = setView;
        vm.login = login;
        vm.register = register;
        vm.disableLogin = disableLogin;
        vm.disableRegister = disableRegister;
        vm.reset = reset;
        vm.demo = demo;

        function activeView(view) {
            return view === currentView ? 'active': void 0;
        }

        function setView(view) {
            currentView = view;
        }

        function login() {
            userService.login(vm.user.name, vm.user.password, vm.user.remember).then(function (response) {
                $location.path('/home')
            }, function (error) {
                console.error(error);
            });
        }

        function register() {
            userService.register(vm.user.name, vm.user.password, vm.user.email).then(function (user) {
                $location.path('/home')
            }, function (error) {
                console.error(error);
            });
        }

        function reset() {
            console.log('This feature has not been implemented yet');
        }

        function demo() {
            userService.demo().then(function () {
                $location.path('/home');
            });
        }

        function disableLogin() {
            return !vm.user.name || !vm.user.password;
        }

        function disableRegister() {
            return !vm.user.name || !vm.user.email || !vm.user.password;
        }
        
    }
});
