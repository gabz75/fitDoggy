define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.service', ['common.service'])
		.service('detailsService', detailsService);

	detailsService.$inject = ['httpService'];
	function detailsService(httpService) {
		this.getDog = getDog;
		this.getWeightData = getWeightData;
		this.deleteDog = deleteDog;

		function getDog(id) {
			return httpService.post('/dog', {
				id: id,
			});
		}

		function getWeightData(id, startDate, endDate) {
			return httpService.post('/dog/weights', {
				id: id,
				startDate: startDate,
				endDate: endDate
			});
		}

		function deleteDog(id) {
			return httpService.post('/dog/delete', {
				id: id
			});
		}
	}
});
