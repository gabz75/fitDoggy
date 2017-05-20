define([
	'angular',
	'dateformat'
], function (angular, dateformat) {
	'use strict';

	angular.module('home.controller', ['common.pubsub', 'home.service'])
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', 'pubsub', 'homeService'];
	function homeCtrl($scope, pubsub, homeService) {
		var vm = this;

		vm.getDogs = getDogs;

		init();

		function init() {
			pubsub.initSubscriptions();
			getDogs();
			vm.date = dateformat(new Date(), 'mmddyyyy');

		}

		function getDogs() {
			homeService.getDogs().then(function (response) {
				vm.dogs = response;
				console.log(response);
			}, function (error) {
				//openErrorModal(error);
				console.error(error);
				vm.dogs = [];
			});
		}

	}
});
