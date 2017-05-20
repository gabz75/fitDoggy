define([
	'angular',
	'lodash',
	'dateformat'
], function (angular, _, dateformat) {
	'use strict';

	angular.module('details.controller', ['common.cache', 'details.service'])
	.controller('detailsCtrl', detailsCtrl);

	detailsCtrl.$inject = ['$location', 'cache', 'detailsService'];
	function detailsCtrl($location, cache, detailsService) {
		var vm = this,
			dogId;
		vm.date = {};

		init();

		function init() {
			var today = new Date();
			dogId = $location.url().split('/')[2];
			vm.date = {
				prev: dateformat(today.getDate() - 1, 'mmddyyyy'),
				current: dateformat(today, 'mmddyyyy'),
				next: dateformat(today.getDate() + 1, 'mmddyyyy')
			};
			detailsService.getDog(dogId).then(function (response) {
				vm.dog = response;
			});

			detailsService.getLog(dogId, vm.date).then(function (response) {
				console.log(response);
				vm.dog = response;
			}, function (error) {
				//openErrorModal(error);
				console.log(error);
			});
		}
	}
});
