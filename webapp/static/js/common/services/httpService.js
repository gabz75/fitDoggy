define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('common.service', ['common.cacheService', 'common.notification'])
		.service('httpService', httpService);

	httpService.$inject = ['$q', '$http', 'cacheService'];
	function httpService($q, $http, cacheService) {
		this.post = post;
		this.upload = upload;

		function post(url, queryParams, upload) {	
			var deferred = $q.defer(),
				cached = cacheService.get(url, queryParams);
			if (cached) {
				deferred.resolve(cached);
			} else {
				$http.post(url, queryParams).then(function (response) {
					deferred.resolve(response.data);
					cacheService.set(url, queryParams, response.data);
				}, function (response) {
					deferred.reject(response.data);
				});
			}	
			
			return deferred.promise;
		}

		function upload(url, queryParams) {
			return $http.post(url, queryParams, {
	            headers: { 
	            	'Content-Type': undefined 
	            },
				transformRequest: function (data, headersGetter) {
					var formData = new FormData();
	                _.forEach(data, function (value, key) {
	                    formData.append(key, value);
	                });
	                return formData;
				}
			}).then(function (response) {
				return response.data;
			}, function (response) {
				return response.data;
			});
		}
	}
});
