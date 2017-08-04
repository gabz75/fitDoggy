define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('calendar.service', ['common.service'])
		.service('calendarService', calendarService);
	
	calendarService.$inject = ['httpService'];
	function calendarService(httpService) {
		this.getImages = getImages;

		function getImages(id) {
			return httpService.post('/dog/images', {}).then(function (response) {
				var images = {};
				_.forEach(response, function (dog) {
					if (dog.dogId == id) {
						images[dog.date] = dog.thumbnailUrl;
					}
				});
				return images;
			});
		}
	}
});
