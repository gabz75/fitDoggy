define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('home.service', ['common.service'])
		.service('homeService', homeService);
	
	homeService.$inject = ['httpService'];
	function homeService(httpService) {
		this.getDogs = getDogs;

		function getDogs() {
			return httpService.post('/dog/all', {}).then(function (response) {
				return response;
			}, function (error) {
				console.error(error)
			});
		}
	}
});
