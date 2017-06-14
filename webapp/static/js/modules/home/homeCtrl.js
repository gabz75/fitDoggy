define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('home.controller', ['common.dialog', 'home.service'])
		.animation('.transition', transition)
		.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', '$interval', 'dialog', 'homeService'];
	function homeCtrl($scope, $interval, dialog, homeService) {
		var vm = this;

		vm.getDogs = getDogs;

		init();

		function init() {
			getDogs();
			homeService.getSlideshow().then(function (response) {
				vm.images = response;
				slideshow();
			});
			vm.date = moment().format('MMDDYYYY');
		}

		function getDogs() {
			homeService.getDogs().then(function (response) {
				vm.dogs = response;
			}, function (error) {
				dialog.error(error);
				vm.dogs = [];
			});
		}

		function slideshow() {
			var index = 0,
				length = vm.images.length;
			vm.slideshow = vm.images[index];
				
			$interval(function () {
				index++;
				if (index == length) {
					index = 0;
				}
				vm.slideshow = vm.images[index];
			}, 3000);
			
		}
	}

	function transition() {
		return {
			leave: function(element, done) {
				element[0].style.opacity = 0;
				setTimeout(done, 1500);
			}
		}
	}
	
});
