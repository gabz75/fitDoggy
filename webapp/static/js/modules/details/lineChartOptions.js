define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.lineChartOptions', [])
	.factory('lineChartOptions', lineChartOptions);

	function lineChartOptions() {
		return function (options) {
			return {
				chart: {
					type: 'spline',
					zoomType: 'x'
				},
				title: {
					text: options.title
				},
				subtitle: {
					text: options.subtitle
				},
				yAxis: {
					title: {
						text: options.yAxis
					}
				},
				xAxis: {
					type: 'datetime'
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					enabled: false
				},
				series: options.series
			}
		}
	}
});
