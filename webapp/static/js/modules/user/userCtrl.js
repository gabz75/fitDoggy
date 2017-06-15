define([
    'angular',
    'moment',
    'lodash'
], function (angular, moment, lodash) {
    'use strict';

    angular.module('user.controller', ['common.notification', 'user.service'])
        .controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$location', 'Notification', 'userService'];
    function userCtrl($location, Notification, userService) {
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
                if (response.status === 'success') {
                    $location.path('/home');
                } else {
                    Notification({
                        message: response.message, 
                        length: 5,
                        status: response.status
                    });
                }
            }, function (error) {
                console.error(error);
            });
        }

        function register() {
            userService.register(vm.user.name, vm.user.password, vm.user.email).then(function (response) {
                if (response.status === 'success') {
                    $location.path('/home');
                } else {
                    Notification({
                        message: response.message, 
                        length: 5,
                        status: response.status
                    });
                }
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
