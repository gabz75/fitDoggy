define([
	'angular',
	'moment',
	'lodash'
], function (angular, moment, lodash) {
	'use strict';

	angular.module('log.controller', ['common.cache', 'common.dialog', 'log.service', 'log.formFactory'])
		.controller('logCtrl', logCtrl);

	logCtrl.$inject = ['$scope', '$compile', '$location', 'Cache', 'dialog', 'logService', 'logFormFactory'];
	function logCtrl($scope, $compile, $location, Cache, dialog, logService, logFormFactory) {
		var vm = this,
			counts = {},
			cache = {},
			currentDay,
			dogId,
			today;

		vm.date = {};
		vm.intensities = ['Light', 'Normal', 'Hard'];
		vm.notInFuture = notInFuture;
		vm.calculateCalories = calculateCalories;
		
		vm.editLog = editLog;
		vm.cancelLog = cancelLog;
		vm.saveLog = saveLog;
		vm.addLog = addLog;
		vm.deleteLog = deleteLog;
		
		vm.openModal = openModal;
	
		init();

		function init() {
			currentDay = moment($location.url().split('/')[4], 'MMDDYYYY');
			dogId = $location.url().split('/')[2];
			today = moment();
			
			if (!notInFuture(currentDay)) {
				$location.path('/dog/' + dogId + '/date/' + today.format('MMDDYYYY'));
			}

			counts.food = 0;
			counts.activity = 0;
			cache.food = new Cache();
			cache.exercise = new Cache();
			
			vm.date.prev = moment(currentDay).subtract(1, 'day').format('MMDDYYYY');
			vm.date.current = currentDay.format('MMDDYYYY'),
			vm.date.next = moment(currentDay).add(1, 'day').format('MMDDYYYY')

			getDog(dogId);
			getLog();
			getActivities();
			getFoods();
		}

		function createLog() {
			$location.path('/dog/' + dogId + '/date/' + currentDay.format('MMDDYYYY') + '/update');
		}

		function notInFuture(date) {
			return moment(date, 'MMDDYYYY').isSameOrBefore(today);
		}

		function editLog(type, index) {
			var logItem = vm.log[type][index];
			logItem.edited = true;
			cache[type].setData(angular.copy(logItem), logItem.id);
		}

		function cancelLog(type, index) {
			var logItem = vm.log[type][index];
			delete logItem.edited;
			if (logItem.new) {
				vm.deleteLog(type, index);
			} else {
				vm.log[type][index] = cache[type].getData(logItem.id);
			}
		}

		function getLog() {
			return logService.getLog(dogId, vm.date.current).then(function (response) {
				vm.log = response;
				if (vm.log) {
					vm.log.totalCalories = 0;
					_.forEach(vm.log.food, function (food) {
						vm.log.totalCalories += food.calories;
						counts.food++;
					});
					counts.exercise = _.keys(vm.log.exercise).length - 1;
				} 
			}, function (error) {
				console.error(error);
			});
		}

		function getDog(dogId) {
			return logService.getDog(dogId).then(function (response) {
				vm.dog = response;
			});
		}

		function getActivities() {
			return logService.getActivities().then(function (response) {
				vm.activities = response;
			});
		}
		function getFoods() {
			return logService.getFoods().then(function (response) {
				vm.foods = response;
			});
		}

		function openModal(type) {
			dialog.popup({}, {
				title: 'Add an ' + capitalize(type),
				messageTemplate: logFormFactory.addNewForm(type),
				buttons: [{
	                label: 'Cancel',
	                cssClass: 'btn-secondary'
	            }, {
	                label: 'Add',
	                cssClass: 'btn-success',
	                ngDisabled: disableAdd(type),
	                actionCallback: addNew(type)
	            }]
			});
		}

		function addNew(type) {
			return function (modalVM) {
				if (!modalVM.item) {
					modalVM.warning = true;
					return;
				}
				logService.addNew(type, modalVM.item).then(function (response) {
					if (response.message) {
						notify({
							message: response.message
						});
					} else {
						if (type === 'activity') {
							vm.activities.push(response);
						} else if (type === 'food') {
							vm.foods.push(response);
						}
					}
				});
			}
		}

		function disableAdd(type) {
			return function (modalVM) {
				return !modalVM.item[type];
			}
		}

		function addLog(type) {
			counts[type]++;
			vm.log[type][counts[type]] = {
				edited: true,
				new: true
			};
		}

		function deleteLog(type, n) {
			counts[type]--;
			delete vm.log[type][n];
		}

		function saveLog(type, index) {
			logService.saveLog(type, vm.log.id, vm.log[type][index]).then(function (response) {
				delete vm.log[type][index].edited;			
				delete vm.log[type][index].new;			
			}, function (response) {
				console.error(response);
			});
		}

		function calculateCalories(n) {
			var oldCalories = vm.log.food[n].calories,
				food = _.find(vm.foods, function (food) {
					return food.id == vm.log.food[n].foodId;
				});
			vm.log.food[n].calories = food.calories * vm.log.food[n].amount / food.serving;
			vm.log.totalCalories += vm.log.food[n].calories - oldCalories;
		}

		function capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}
});
