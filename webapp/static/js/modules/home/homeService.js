define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('home.service', [])
		.service('home.service', homeService);
	
	homeService.$inject = ['$http'];
	function homeService($http) {
		this.getDogs = getDogs;
		this.addNewDog = addNewDog;

		function getDogs() {
			return $http({
				method: 'POST',
				url: '/getDogs',
			}).then(function (response) {
				return response.data;
			}, function (error) {
			//openErrorModal(error);
			console.log(error);
			return error;
		});
		}


		function addNewDog(dog) {
			return $http({
				method: 'POST',
				url: '/addDog',
				dog: dog
			}).then(function (response) {
			//show
		}, function (error) {
			//openErrorModal(error);
			return error;
		});
		}

		function getDog(id) {			
			return $http({
				method: 'POST',
				url: '/getDog',
				data: {
					id: id
				}
			}).then(function (response) {
				return response.data;
			}, function (error) {
			//openErrorModal(error);
			console.log(error);
			return error;
		});
		}
	}
});
