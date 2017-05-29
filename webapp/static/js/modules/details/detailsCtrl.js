define([
	'angular',
	'moment',
	'highcharts'
], function (angular, moment, highcharts) {
	'use strict';

	angular.module('details.controller', ['common.dialog', 'details.service', 'details.lineChartOptions'])
	.controller('detailsCtrl', detailsCtrl);

	detailsCtrl.$inject = ['$q', '$location', 'dialog', 'detailsService', 'lineChartOptions'];
	function detailsCtrl($q, $location, dialog, detailsService, lineChartOptions) {
		var vm = this, 
			dogId,
			today,
			chart;

		init();

		function init() {
			today = moment();
			dogId = $location.url().split('/')[2];
			vm.dog = {};
			vm.incr = 0;
			vm.chartTypes = [{
				value: 'week',
				label: 'Weekly'
			}, {
				value: 'month',
				label: 'Monthly'
			}, {
				value: 'year',
				label: 'Yearly'
			}];
			vm.chartType = vm.chartTypes[0];
			vm.next = next;
			vm.hasNext = hasNext;
			vm.prev = prev;
			vm.hasPrev = hasPrev;
			vm.setType = setType;
			vm.confirmDelete = confirmDelete;

			$q.all([detailsService.getDog(dogId), getChartData()]).then(function (response) {
				vm.dog = response[0];
				chart = Highcharts.chart('linechart', lineChartOptions({
					title: vm.chartType.label + ' Weight Change',
					subtitle: vm.startDate.format('MM/DD/YYYY') + ' to ' + vm.endDate.format('MM/DD/YYYY'),
					yAxis: 'Weight (' + vm.dog.metric + ')',
					series: response[1] || []
				}));
			});
		}

		function setType(type) {
			var prevChartType = vm.chartType,
				prevIncr = vm.incr;
			vm.chartType = type;
			vm.incr = 0;

			if (prevChartType !== vm.chartType) {
				getChartData().then(function (response) {
					chart.update({
				        title: vm.chartType.label + ' Weight Change',
						subtitle: vm.startDate.format('MM/DD/YYYY') + ' to ' + vm.endDate.format('MM/DD/YYYY'),
						series: response
				    });
				})
			}
		}

		function next() {
			vm.incr++;
			getChartData().then(function (response) {
				chart.series[0].setData(response, true);
			});
		}

		function hasNext() {
			return moment(today).add(vm.incr, vm.chartType.value).isSameOrBefore(today);
		}

		function prev() {
			vm.incr--;
			getChartData().then(function (response) {
				chart.series[0].setData(response, true);
			});
		}

		function hasPrev() {
			return moment(today).add(vm.incr, vm.chartType.value).isSameOrAfter(moment(vm.dog.date, 'MM/DD/YYYY'));
		}

		function getChartData() {
			vm.startDate = moment(today).add(vm.incr, vm.chartType.value).startOf(vm.chartType.value);
			vm.endDate = moment(today).add(vm.incr, vm.chartType.value).endOf(vm.chartType.value);
			return detailsService.getWeightData(dogId, vm.startDate.format('MMDDYYYY'), vm.endDate.format('MMDDYYYY'));
		}

		function confirmDelete() {
			dialog.popup({}, {
				title: 'Delete',
				message: 'Are you sure you want to delete all data for ' + vm.dog.name + '?',
				buttons: [{
	                label: 'No',
	                cssClass: 'btn-secondary'
	            }, {
	                label: 'Yes',
	                cssClass: 'btn-primary',
	                actionCallback: deleteDog
	            }]
			})
		}

		function deleteDog() {
			detailsService.deleteDog(dogId);
			$location.path('/#!/home')
		}
	}
});
