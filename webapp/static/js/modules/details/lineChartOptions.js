define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('details.lineChartOptions', [])
		.factory('lineChartOptions', lineChartOptions);

	function lineChartOptions() {
		return function (options) {
			return {
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
			    legend: {
			        layout: 'vertical',
			        align: 'right',
			        verticalAlign: 'middle'
			    },
			    series: options.series
			}
		}
	}
});
