define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('log.controller', ['common.dialog', 'log.service'])
	.controller('logCtrl', logCtrl);

	logCtrl.$inject = ['$location', 'dialog', 'logService'];
	function logCtrl($location, dialog, logService) {
		var vm = this,
			dogId;
		vm.date = {};

		init();

		function init() {
			var today = moment($location.url().split('/')[4], 'mmddyyyy'),
				dogId = $location.url().split('/')[2];
			vm.date = {
				prev: today.subtract(1, 'day').format('mmddyyyy'),
				current: today.format('mmddyyyy'),
				next: today.add(1, 'day').format('mmddyyyy')
			};

			logService.getDog(dogId).then(function (response) {
				vm.dog = response;
			});

			logService.getLog(dogId, vm.date.current).then(function (response) {
				if (response.length > 0) {
					vm.log = response;
				} else {
					dialog.popup({}, {
						title: 'Create a log',
						message: 'This day doesn\'t have a log yet. Create one?',
						buttons: [{
			                label: 'No',
			                cssClass: 'btn-secondary'
			            }, {
			                label: 'Yes',
			                cssClass: 'btn-primary',
			                actionCallback: createLog
			            }]
					});
				}
			});
		}

		function createLog() {
			$location.path('/#!/home');
		}
	}
});
