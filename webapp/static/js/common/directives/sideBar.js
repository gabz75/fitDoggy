define([
    'angular',
    'moment'
], function (angular, moment) {
    'use strict';

    angular.module('common.sideBar', [])
        .controller('sideBarCtrl', sideBarCtrl)
        .directive('sideBar', sideBar);

    sideBarCtrl.$inject = ['$scope', '$location'];
    function sideBarCtrl($scope, $location) {
        var vm = this;
        vm.expanded = {};
        vm.date = moment().format('MMDDYYYY');
        vm.dog = {};
        vm.activeTab = activeTab;
        vm.expand = expand;
        vm.toggle = toggle;
        vm.collapsed = false;

        init();

        function init() {
            vm.dog = $scope.dog;
            vm.expanded[vm.dog.name] = true;
        }

        function activeTab(dogId, tab) {
            var logPath = $location.path().match(/\/dog\/(\d+)\/date\//),
                isLog = logPath && logPath[1] == dogId && tab === 'log',
                overviewPath = $location.path().match(/\/dog\/(\d+)$/),
                isOverview =  overviewPath && overviewPath[1] == dogId && tab === 'overview';
            if (isOverview || isLog) {
                return 'active';
            }
            return void 0;
        }
        function expand(dog) {
            vm.expanded[dog] = !vm.expanded[dog];
        }
        function toggle() {
            vm.collapsed = !vm.collapsed;
        }
    }

    function sideBar() {
        return {
            restrict: 'AE',
            scope: {
                dog: '=dog'
            },
            templateUrl: '/static/partials/sidebar.html',
            controller: 'sideBarCtrl',
            controllerAs: 'vm'
        }
    }
});
