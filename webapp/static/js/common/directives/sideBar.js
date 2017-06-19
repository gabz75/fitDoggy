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
        vm.notInFuture = notInFuture;

        init();

        function init() {
            setLogDates();
            vm.dog = $scope.dog;
            vm.expanded[vm.dog.name] = true;
            $scope.$on('$locationChangeSuccess', setLogDates);
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

        function setLogDates() {
            var logDate = $location.path().match(/\/dog\/\d+\/date\/(\d+)/);
            if (logDate && logDate[1]) {
                currentDay = logDate[1];
            } else {
                currentDay = currentDay || moment().format('MMDDYYYY');
            }
            vm.activeLogDate = moment().isSame(moment(currentDay, 'MMDDYYYY')) ? 'Today' : moment(currentDay, 'MMDDYYYY').format('MM/DD/YYYY');
            vm.date = {
                prev: moment(currentDay, 'MMDDYYYY').subtract(1, 'day').format('MMDDYYYY'),
                current: moment(currentDay, 'MMDDYYYY').format('MMDDYYYY'),
                next: moment(currentDay, 'MMDDYYYY').add(1, 'day').format('MMDDYYYY')
            };
        }

        function notInFuture(date) {
            return moment(date, 'MMDDYYYY').isSameOrBefore(moment());
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
