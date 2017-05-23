define([
	'angular',
	'dateformat'
], function (angular, dateformat) {
	'use strict';

	angular.module('details.controller', ['common.dialog', 'common.cache', 'details.service'])
	.controller('detailsCtrl', detailsCtrl);

	detailsCtrl.$inject = ['$location', 'dialog', 'cache', 'detailsService'];
	function detailsCtrl($location, dialog, cache, detailsService) {
		var vm = this,
			dogId;

		init();

		function init() {
			dogId = $location.url().split('/')[2];
			detailsService.getDog(dogId).then(function (response) {
				vm.dog = response;
			});
		}
	}
});
