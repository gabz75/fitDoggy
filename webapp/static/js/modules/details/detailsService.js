define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.service', ['common.service'])
		.service('detailsService', detailsService);

	detailsService.$inject = ['$q', 'httpService'];
	function detailsService($q, httpService) {
		var prevStartDate,
			prevEndDate,
			data;
		this.getDog = getDog;
		this.getData = getData;
		this.deleteDog = deleteDog;

		function getDog(id) {
			return httpService.post('/dog', {
				id: id,
			});
		}

		function getData(id, startDate, endDate) {
			if (prevStartDate !== startDate || prevEndDate !== endDate) {
				prevStartDate = startDate;
				prevEndDate = endDate;
				return httpService.post('/dog/data', {
					id: id,
					startDate: startDate,
					endDate: endDate
				}).then(function (response) {
					data = response;
					return response;
				});
			}
			var deferred = $q.defer();
			deferred.resolve(data);
			return deferred.promise;
			
		}

		function deleteDog(id) {
			return httpService.post('/dog/delete', {
				id: id
			});
		}
	}
});
