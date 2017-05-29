define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('common.service', ['common.service', 'common.cacheService'])
		.service('httpService', httpService);

	httpService.$inject = ['$q', '$http', 'cacheService'];
	function httpService($q, $http, cacheService) {
		this.post = post;

		function post(url, queryParams) {	
			var deferred = $q.defer(),
				cached = cacheService.get(url, queryParams);
			if (cached) {
				deferred.resolve(cached);
			} else {
				$http({
					method: 'POST',
					url: url,
					data: queryParams
				}).then(function (response) {
					if (response.status !== 500) {
						deferred.resolve(response.data);
						cacheService.set(url, queryParams, response.data);
					} else {
						deferred.reject(response.data);
					}
				}, function (response) {
					deferred.reject(response.data);
				});
			}			
			
			return deferred.promise;
		}
	}
});
