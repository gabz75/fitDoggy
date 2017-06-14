define([
    'angular',
    'moment'
], function (angular, moment) {
    'use strict';

    angular.module('common.footer', ['common.service', 'common.breadcrumb'])
        .controller('footerMenuCtrl', footerMenuCtrl)
        .directive('footerMenu', footerMenu);

    footerMenuCtrl.$inject = ['$rootScope', '$location', '$cookies', '$timeout', 'httpService', 'breadcrumb'];
    function footerMenuCtrl($rootScope, $location, $cookies, $timeout, httpService, breadcrumb) {
        var vm = this;
        vm.logout = logout;
        vm.showFullMenu = showFullMenu;
        vm.hideFullMenu = hideFullMenu;
        init();

        function init() {
            vm.link2 = {}
            setState();

            $rootScope.$on('$locationChangeSuccess', function () {
                setState();
            });
        }

        function logout() {
            httpService.post('/user/logout', {}).then(function () {
                $cookies.remove('demo');
                $cookies.remove('user');
            });
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

        function setState() {
            vm.loggedIn = $cookies.getObject('user') || $cookies.getObject('demo');
            vm.previous = breadcrumb.getPrevious();
            var path = $location.path().match(/\/dog\/(\d)(\/date\/(\d+))?/),
                previousDogId = vm.dogId;
            if (path) {
                vm.dogId = path[1];
                vm.logDate = path[3];
                if (previousDogId !== vm.dogId) {
                    httpService.post('/dog', {
                        id: vm.dogId
                    }).then(function (response) {
                        vm.dog = response;
                        setCurrentDogUrl();
                    });
                } else {
                    setCurrentDogUrl();
                }
            } else {
                delete vm.dogId;
                delete vm.logDate;
                vm.link2 = {};
            }
        }

        function setCurrentDogUrl() {
            if (vm.logDate) {
                vm.link2.label = vm.dog.name;
                vm.link2.url = '#!/dog/' + vm.dog.id +'/';
            }  else {
                vm.link2.label = 'Log';
                vm.link2.url = '#!/dog/' + vm.dog.id +'/date/' + moment().format('MMDDYYYY');
            }
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
