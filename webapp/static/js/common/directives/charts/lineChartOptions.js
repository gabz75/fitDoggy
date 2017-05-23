define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('common.lineChartOptions', [])
		.factory('lineChartOptions', lineChartOptions);

	function lineChartOptions(options) {
		return {

		    title: {
		        text: options.title
		    },

		    subtitle: {
		        text: options.subtitle || ''
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
});
