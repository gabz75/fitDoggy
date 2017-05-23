define([
	'angular',
	'modules/log/logCtrl',
	'modules/log/logService'
], function (angular) {
	'use strict';

	angular.module('log', [
		'log.controller', 
		'log.service'
	]);

});
