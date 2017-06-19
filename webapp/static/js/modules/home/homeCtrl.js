define([
	'angular',
	'moment'
	], function (angular, moment) {
	'use strict';

	angular.module('home.controller', ['home.service'])
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', '$window', 'homeService'];
	function homeCtrl($scope, $window, homeService) {
		var vm = this;

		vm.getDogs = getDogs;
		vm.logout = logout;

		init();

		function init() {
			getDogs();
			homeService.getImages().then(function (response) {
				vm.images = response;
			});
			vm.quote = homeService.getQuote();
			vm.date = moment().format('MMDDYYYY');
			angular.element($window).on('scroll', function() {
				if (this.pageYOffset >= 50) {
					vm.scrolled = true;
				} else {
					vm.scrolled = false;
				}
			});
		}

		function getDogs() {
			homeService.getDogs().then(function (response) {
				vm.dogs = response;
			}, function (error) {
				vm.dogs = [];
			});
		}

		function logout() {
			homeService.logout();
		}
	}

});
