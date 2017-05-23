define([
	'angular',
	'highcharts'
], function (angular, highcharts) {
	'use strict';

	angular.module('common.lineChart', [])
		.controller('lineChartCtrl', lineChartCtrl)
		.directive('lineChart', lineChart);

	function httpService() {
		return {
			template: '<div id="highcharts"></div>',
			scope: {
				options: '='
			},
			controller: 'lineChartCtrl'
		}
	}

	function lineChartCtrl($scope) {
		Highcharts.chart('container', $scope.options);
	}
});
