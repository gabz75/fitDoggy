define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('home.service', ['common.service', 'common.cache'])
		.service('homeService', homeService);
	
	homeService.$inject = ['httpService', 'cache'];
	function homeService(httpService, cache) {
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
