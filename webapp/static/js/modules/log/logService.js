define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('log.service', ['common.service', 'common.dialog'])
	.service('logService', logService);

	logService.$inject = ['httpService', 'dialog'];
	function logService(httpService, dialog) {
		this.getLog = getLog;
		this.getDog = getDog;

		function getLog(id, date) {			
			return httpService.post('/dog/log', {
				id: id,
				date: date
			}).then(function (response) {
				return response;
			}, function (error) {
				dialog.error(error);
			});
		}

		function getDog(id) {
			return httpService.post('/dog', {
				id: id,
			}).then(function (response) {
				return response;
			}, function (error) {
				dialog.error(error);
			});
		}
	}
});
