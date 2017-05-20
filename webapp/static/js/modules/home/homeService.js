define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('home.service', ['common.cache'])
		.service('homeService', homeService);
	
	homeService.$inject = ['$http', 'cache'];
	function homeService($http, cache) {
		this.getDogs = getDogs;

		function getDogs() {
			return $http({
				method: 'POST',
				url: '/dog/all',
			}).then(function (response) {
				cache.setDogs = response.data;
				return response.data;
			}, function (error) {
				//openErrorModal(error);
				console.error(error);
				return error;
			});
		}
	}
});
