define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('calendar.controller', ['calendar.service'])
		.controller('calendarCtrl', calendarCtrl);

	calendarCtrl.$inject = ['$rootScope', 'calendarService'];
	function calendarCtrl($rootScope, calendarService) {
		var vm = this,
			today = moment();
		vm.dog = $rootScope.selectedDog;
		vm.current = today;
		vm.week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		vm.next = next;
		vm.prev = prev;
		vm.hasPrev = hasPrev;
		vm.hasNext = hasNext;
		vm.dateClass = dateClass;
		vm.images = [];
		vm.days = [];

		init();

		function init() {
			calendarService.getImages(vm.dog.id).then(function (response) {
				vm.images = response;
				vm.days = initDays();
			});

		}

		function next() {
			vm.current = moment(vm.current.date).add(1, 'month');
			vm.days = initDays();
		}

		function prev() {
			vm.current = moment(vm.current.date).subtract(1, 'month');
			initDays();
		}

		function hasPrev() {
			console.log(moment(vm.current).subtract(1, 'month').format('MM/DD/YYYY'), vm.dog.date);
			return moment(vm.dog.date, 'MM/DD/YYYY').isSameOrAfter(moment(vm.current).subtract(1, 'month'));
		}

		function hasNext() {
			return moment(today).isSameOrAfter(moment(vm.current).add(1, 'month'));
		}

		function initDays() {
			var days = [],
				startOfMonth = moment(vm.current).startOf('month'),
				startOfWeek = moment(startOfMonth).startOf('week'),
				endOfMonth = moment(vm.current).endOf('month'),
				endOfWeek = moment(endOfMonth).endOf('week'),
				current = startOfWeek;
			while (current.isSameOrBefore(endOfWeek)) {
				var formatted = moment(current).format('MMDDYYYY');
				days.push({
					date: moment(current),
					logUrl: '#!/dog/' + vm.dog.id + '/date/' + formatted,
					img: vm.images[formatted] || ''
				});
				current.add(1, 'day');
			}
			return days;
		}

		function isToday(day) {
			return ;
		}

		function isMonth(day) {
			console.log(moment(day).isSame(vm.current, 'month'));
			return ;
		}

		function dateClass(day) {
			if (moment(day).isSame(today)) {
				return 'today';
			} else if (!moment(day).isSame(vm.current, 'month')) {
				return 'different-month';
			} else {
				return '';
			}
		}

	}
});
