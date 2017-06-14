define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('home.service', ['common.service'])
		.service('homeService', homeService);
	
	homeService.$inject = ['httpService'];
	function homeService(httpService) {
		this.getDogs = getDogs;
		this.getSlideshow = getSlideshow;

		function getDogs() {
			return httpService.post('/dog/all', {});
		}

		function getSlideshow() {
			return httpService.post('/dog/slideshow', {});
		}
	}
});
