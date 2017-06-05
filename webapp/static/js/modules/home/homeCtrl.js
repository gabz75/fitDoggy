define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('home.controller', ['common.dialog', 'home.service'])
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', 'dialog', 'homeService'];
	function homeCtrl($scope, dialog, homeService) {
		var vm = this;

		vm.getDogs = getDogs;

		init();

		function init() {
			getDogs();
			vm.date = moment().format('MMDDYYYY');
		}

		function getDogs() {
			homeService.getDogs().then(function (response) {
				vm.dogs = response;
			}, function (error) {
				dialog.error(error);
				vm.dogs = [];
			});
		}
	}
});
