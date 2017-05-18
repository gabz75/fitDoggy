define([
	'angular',
	'modules/home/homeService'
], function (angular) {
	'use strict';

	angular.module('home.controller', ['home.service'])
		.controller('home.controller', homeCtrl);

	homeCtrl.$inject = ['home.service'];
	function homeCtrl(homeService) {
		var vm = this;

		vm.getDogs = getDogs;
		vm.addNewDog = addNewDog;
		vm.getDog = getDog;

		function getDogs() {
			homeService.getDogs().then(function (response) {
				vm.dog = response;
			}, function (error) {
		//openErrorModal(error);
		console.log(error);
	});
		}

		function addNewDog() {
			homeService.addNewDog().then(function (response) {

			}, function (error) {
		//openErrorModal(error);
		console.log(error);
	});
		}

		function getDog(id) {
			homeService.getDog(id).then(function (response) {
				vm.dog = response;
			}, function (error) {
		//openErrorModal(error);
		console.log(error);
	});
		}
	}
});
