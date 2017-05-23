define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('common.service', ['common.service', 'common.cache'])
		.service('httpService', httpService);

	httpService.$inject = ['$q', '$http', 'cache'];
	function httpService($q, $http, cache) {
		this.post = post;

		function post(url, queryParams) {	
			var deferred = $q.defer(),
				cached = cache.get(url, queryParams);
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
					} else {
						deferred.reject(response.data)
					}
				});
			}			
			
			return deferred.promise;
		}
	}
});
