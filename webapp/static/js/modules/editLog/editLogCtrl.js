define([
	'angular',
	'moment',
	'angular-notify'
], function (angular, moment) {
	'use strict';

	angular.module('editLog.controller', ['cgNotify', 'common.dialog', 'editLog.service', 'editLog.formFactory'])
		.controller('editLogCtrl', editLog);

	editLog.$inject = ['$scope', '$compile', '$location', 'notify', 'dialog', 'editLogService', 'editLogFormFactory'];
	function editLog($scope, $compile, $location, notify, dialog, editLogService, editLogFormFactory) {
		var vm = this,
			numExercises,
			numFoods;
		vm.date = {};
		vm.log = {};
		vm.intensities = ['Light', 'Moderate', 'Hard'];
		vm.activityMetrics = ['km', 'm', 'hh:mm']
		vm.exercises = [];
		vm.foods = [];
		vm.openActivityModal = openActivityModal;
		vm.addExercise = addExercise;
		vm.deleteExercise = deleteExercise;
		vm.openFoodModal = openFoodModal;
		vm.addFood = addFood;
		vm.deleteFood = deleteFood;
		vm.addLog = addLog;

		init();

		function init() {
			var dogId = $location.url().split('/')[2];
			numExercises = 0;
			numFoods = 0;

			editLogService.getDog(dogId).then(function (response) {
				vm.dog = response;
			});

			editLogService.getExercises().then(function (response) {
				vm.exercises = response;
			});

			editLogService.getFoods().then(function (response) {
				vm.foods = response;
			});

			vm.log.exercise = {0: {}};
			vm.log.food = {0: {}};
			vm.log.dogId = dogId;
			vm.log.date = $location.url().split('/')[4];
		}

		function openActivityModal() {
			dialog.popup({}, {
				title: 'Add an Activity',
				messageTemplate: editLogFormFactory.addNewActivityForm(),
				buttons: [{
	                label: 'Cancel',
	                cssClass: 'btn-secondary'
	            }, {
	                label: 'Add',
	                cssClass: 'btn-success',
	                ngDisabled: disableAdd,
	                actionCallback: addNewActivity
	            }]
			});
		}

		function addNewActivity(modalVM) {
			if (!modalVM.item) {
				modalVM.warning = true;
				return;
			}
			editLogService.addNewActivity(modalVM.item, modalVM.description).then(function (response) {
				if (response.message) {
					notify({
						message: response.message
					});
				} else {
					vm.exercises.push(response);
				}
			});
		}

		function openFoodModal() {
			dialog.popup({}, {
				title: 'Add a Food',
				messageTemplate: editLogFormFactory.addNewFoodForm(),
				buttons: [{
	                label: 'Cancel',
	                cssClass: 'btn-secondary'
	            }, {
	                label: 'Add',
	                cssClass: 'btn-success',
	                ngDisabled: disableAdd,
	                actionCallback: addNewFood
	            }]
			});
		}
		function addNewFood(modalVM) {
			if (!modalVM.item) {
				modalVM.warning = true;
				return;
			}
			editLogService.addNewFood(modalVM.item, modalVM.cal, modalVM.serving).then(function (response) {
				if (response.message) {
					notify({
						message: response.message
					});
				} else {
					vm.foods.push(response);
				}
			});
		}

		function disableAdd(modalVM) {
			return !modalVM.item;
		}

		function addExercise() {
			vm.log.exercise[numExercises] = {};
			angular.element(document.querySelector('#exercise' + (numExercises++)))
				.after($compile(editLogFormFactory.addExerciseForm(numExercises))($scope));
		}
		function deleteExercise(n) {
			numExercises--;
			angular.element(document.querySelector('#exercise' + n)).remove();
			delete vm.log.exercise[n];
		}
		function addFood() {
			vm.log.food[numFoods] = {};
			angular.element(document.querySelector('#food' + (numFoods++)))
				.after($compile(editLogFormFactory.addFoodForm(numFoods))($scope));
		}
		function deleteFood(n) {
			numFoods--;
			angular.element(document.querySelector('#food' + n)).remove();
			delete vm.log.food[n];
		}
		function addLog() {
			console.log(vm.log);
			editLogService.addLog(vm.log).then(function (response) {
				$location.path('/dog/' + vm.log.dogId + '/date/' + vm.log.date);
			}, function (response) {
				notify({
					message: response
				});
			});
		}
	}
});
