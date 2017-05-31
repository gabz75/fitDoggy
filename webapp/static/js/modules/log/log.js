define([
	'angular',
	'modules/log/logCtrl',
	'modules/log/logService',
	'modules/log/pieChartDirective',
	'modules/log/logFormFactory',
	'modules/log/pieChartOptions'
], function (angular) {
	'use strict';

	angular.module('log', [
		'log.controller', 
		'log.service',
		'log.formFactory',
		'log.pieChart',
		'log.pieChartOptions'
	]);

});
