define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('log.modal', ['common.service'])
		.controller('logModal', logModal);

	logModal.$inject = ['httpService', 'options'];
	function logModal(httpService, options) {
		vm.options = options;
		console.log(options);
	}
});
