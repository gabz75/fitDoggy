define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.service', ['common.service', 'common.dialog'])
	.service('detailsService', detailsService);

	detailsService.$inject = ['httpService', 'dialog'];
	function detailsService(httpService, dialog) {
		this.getDog = getDog;

		function getDog(id) {
			return httpService.post('/dog', {
				id: id,
			}).then(function (response) {
				return response;
			}, function (error) {
				console.error(error);

			});
		}
	}
});
