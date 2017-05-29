define([
	'angular',
	'modules/log/logCtrl',
	'modules/log/logService',
	'modules/log/logFormFactory'
], function (angular) {
	'use strict';

	angular.module('log', [
		'log.controller', 
		'log.service',
		'log.formFactory'
	]);

});
