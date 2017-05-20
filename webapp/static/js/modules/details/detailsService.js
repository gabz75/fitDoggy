define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.service', ['common.cache'])
		.service('detailsService', detailsService);

	detailsService.$inject = ['$q', '$http', 'cache'];
	function detailsService($q, $http, cache) {
		this.getLog = getLog;
		this.getDog = getDog;

		function getLog(id, date) {			
			return $http({
				method: 'POST',
				url: '/dog/log',
				data: {
					id: id,
					date: date
				}
			}).then(function (response) {
				return response.data;
			}, function (error) {
				//openErrorModal(error);
				console.error(error);
				return error;
			});
		}

		function getDog(id) {
			if (cache.getDog(id)) {
				var deferred = $q.defer();
				deferred.resolve(cache.getDog(id));
				return deferred.promise;
			}
			return $http({
				method: 'POST',
				url: '/dog',
				data: {
					id: id,
				}
			}).then(function (response) {
				return response.data;
			}, function (error) {
				//openErrorModal(error);
				console.error(error);
				return error;
			});
		}
	}
});
