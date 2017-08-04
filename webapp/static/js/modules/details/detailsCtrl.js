define([
	'angular',
	'moment',
	'highcharts'
], function (angular, moment, highcharts) {
	'use strict';

	angular.module('details.controller', ['common.dialog', 'details.service', 'details.lineChartOptions'])
	.controller('detailsCtrl', detailsCtrl);

	detailsCtrl.$inject = ['$location', 'dialog', 'detailsService', 'lineChartOptions'];
	function detailsCtrl($location, dialog, detailsService, lineChartOptions) {
		var vm = this, 
			today = moment(),
			dogId,
			chart;

		vm.dog = {};
		vm.incr = 0;
		vm.chartTypes = [{
			value: '0',
			label: 'Weight'
		}, {
			value: '1',
			label: 'Caloric Intake',
			title: 'Calories'
		}, {
			value: '2',
			label: 'Exercise',
			title: 'Duration (min)'
		}];
		vm.date = today.format('MMDDYYYY');
		vm.chartType = vm.chartTypes[0];
		vm.setType = setType;
		vm.confirmDelete = confirmDelete;
		vm.updateDog = updateDog;
		vm.lightbox = lightbox;
		init();

		function init() {
			setInstructions();
			dogId = $location.url().split('/')[2];
			detailsService.getDog(dogId).then(function (response) {
				vm.dog = response;
				vm.images = [{
					'filename': response.imageFilename,
					'url': response.imageUrl,
					'thumbnailUrl': response.thumbnailUrl
				}];
				vm.chartTypes[0].title = 'Weight (' + vm.dog.metric + ')';
				getChartData().then(function (data) {
					vm.images = _.concat(data[3], vm.images);
					chart = Highcharts.chart('linechart', lineChartOptions({
						title: 'Change In ' + vm.chartType.label,
						subtitle: vm.startDate.format('MM/DD/YYYY') + ' to ' + vm.endDate.format('MM/DD/YYYY'),
						yAxis: vm.chartType.label,
						series: data[vm.chartType.value] || []
					}));
					
				});
			});
		}

		function setType(type) {
			var prevChartType = vm.chartType;
				vm.chartType = type;
			vm.incr = 0;

			if (prevChartType !== vm.chartType) {
				getChartData().then(function (response) {
					updateChart(response);
				});
			}
		}
		
		function getChartData() {
			var startOfYear = moment(today).add(vm.incr, 'year').startOf('year'),
				endOfYear = moment(today).add(vm.incr, 'year').endOf('year'),
				startOfLog = moment(vm.dog.date, 'MM/DD/YYYY');
			vm.startDate = moment(startOfYear).isSameOrAfter(startOfLog) ? startOfYear : startOfLog;
			vm.endDate = moment(endOfYear).isSameOrBefore(today) ? endOfYear : today;
			return detailsService.getData(dogId, vm.startDate.format('MMDDYYYY'), vm.endDate.format('MMDDYYYY'));

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
			});
		}

		function deleteDog() {
			detailsService.deleteDog(dogId);
			$location.path('/#!/home')
		}

		function setInstructions() {
			vm.instructions = document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in';
		}

		function updateChart(response) {
			chart.update(lineChartOptions({
				title: 'Change In ' + vm.chartType.label,
				subtitle: vm.startDate.format('MM/DD/YYYY') + ' to ' + vm.endDate.format('MM/DD/YYYY'),
				yAxis: vm.chartType.title,
				series: response[vm.chartType.value] || []
			}));
		}

		function updateDog() {
            $location.path('/dog/' + vm.dog.id + '/update');
		}

		function lightbox(image) {
			dialog.popup({
				templateUrl: '/static/js/common/services/dialog/lightbox.html',
				controller: 'lightbox',
				size: 'lg'
			}, {
				images: vm.images,
				current: image
			});
		}
	}
});
