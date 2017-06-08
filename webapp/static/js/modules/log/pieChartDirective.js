define([
	'angular',
	'highcharts',
	'lodash'
], function (angular, highcharts, lodash) {
	'use strict';

	angular.module('log.pieChart', ['log.pieChartOptions'])
		.controller('pieChartCtrl', pieChartCtrl)
		.directive('pieChart', pieChart);

	pieChartCtrl.$inject = ['$scope', 'pieChartOptions'];
	function pieChartCtrl($scope, pieChartOptions) {
		var vm = this,
			options = $scope.options,
			series = $scope.series,
			total = options.total || _.reduce(series, function(sum, n) {
			  return sum + n[options.collect];
			}, 0),
			totalSoFar = 0,
			data,
			chart;
		options.series = _.map(series, function (item) {
			totalSoFar += item[options.collect];
			return {
				name: item.name, 
				y: item[options.collect] / total,
				formatted: item[options.collect] + options.metric
			};
		});
		if (total !== totalSoFar) {
			options.series.push({
				name: 'Remaining', 
				y: (total - totalSoFar) / total,
				formatted: (total - totalSoFar) + options.metric
			});
		}
		chart = Highcharts.chart('pieChart', pieChartOptions(options));
			
	}

	function pieChart() {
		return {
	        restrict: 'AE',
	        controllerAs: 'vm',
	        controller: 'pieChartCtrl',
	        template: '<div id="pieChart"></div>',
	        scope: {
	        	options: '=',
	        	series: '='
	        }
	    };
	}
});
