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
        var vm = this,
            currentDay;
        vm.expanded = {};
        vm.date = {};
        vm.dog = {};
        vm.activeTab = activeTab;
        vm.expand = expand;
        vm.toggle = toggle;
        vm.collapsed = false;
        init();

        function init() {
            vm.today = moment(currentDay, 'MMDDYYYY').format('MMDDYYYY'),
            vm.dog = $scope.dog;
            vm.expanded[vm.dog.name] = true;
        }

        function activeTab(dogId, tab) {
            var path = $location.path().match(/\/dog\/(\d+)(\/\w*)?/);
            if (!path || path.length < 2 || path[1] !== dogId) {
                return void 0;
            } 
            var isLog = tab === 'log' && path[2] === '/date',
                isOverview = tab === 'overview' && !path[2],
                isCalendar = tab === 'calendar' && path[2] === '/calendar';
            if (isOverview || isLog || isCalendar) {
                return 'active';
            }
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
