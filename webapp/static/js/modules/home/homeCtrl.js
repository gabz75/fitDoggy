define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('home.controller', ['common.dialog', 'common.pubsub', 'home.service'])
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', 'dialog', 'pubsub', 'homeService'];
	function homeCtrl($scope, dialog, pubsub, homeService) {
		var vm = this;

		vm.getDogs = getDogs;

		init();

		function init() {
			pubsub.initSubscriptions();
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
