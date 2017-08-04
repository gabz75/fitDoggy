define([
	'angular',
	'moment',
	'lodash'
], function (angular, moment, lodash) {
	'use strict';

	angular.module('log.controller', ['common.cache', 'common.dialog', 'common.notification', 'common.upload', 'log.service', 'log.formFactory'])
		.controller('logCtrl', logCtrl);

	logCtrl.$inject = ['$location', '$timeout', '$q', 'Cache', 'dialog', 'Notification', 'upload', 'logService', 'logFormFactory'];
	function logCtrl($location, $timeout, $q, Cache, dialog, Notification, upload, logService, logFormFactory) {
		var vm = this,
			counts = {},
			cache = {},
			currentDay,
			today;

		vm.fileTypes = '.jpeg, .jpg, .png, .gif, image/jpeg, image/pjpeg, image/jpeg, image/pjpeg, image/png, image/gif';
		vm.intensities = ['Light', 'Moderate', 'Hard'];
		vm.viewLabel = {
			'img': '',
			'foodChart': 'Daily Caloric Intake',
			'exerciseChart': 'Daily Exercise'
		}
		vm.views = _.keys(vm.viewLabel);
		vm.view = vm.views[0];
		vm.pieChart = {
			food: {
				collect: 'calories',
				name: 'Food',
				metric: 'cal'
			},
			exercise: {
				collect: 'duration',
				name: 'Activity',
				metric: 'min'
			}
		};
		vm.currentDay = '';
		vm.calculateCalories = calculateCalories;
		vm.editLog = editLog;
		vm.cancelLog = cancelLog;
		vm.saveLog = saveLog;
		vm.addLog = addLog;
		vm.deleteLog = deleteLog;
		vm.editWeight = editWeight;
		vm.saveWeight = saveWeight;
		vm.openModal = openModal;
		vm.prev = prev;
		vm.next = next;

		vm.uploadFile = uploadFile;
		init();

		function init() {
			currentDay = $location.url().split('/')[4];
			vm.dogId = $location.url().split('/')[2];
			today = moment();
			
			if (!notInFuture(currentDay)) {
				$location.path('/dog/' + vm.dogId + '/date/' + today.format('MMDDYYYY'));
			}
			vm.currentDay = moment(currentDay, 'MMDDYYYY').format('MMMM D, YYYY');
			vm.date = {
                prev: moment(currentDay, 'MMDDYYYY').subtract(1, 'day').format('MMDDYYYY'),
                next: moment(currentDay, 'MMDDYYYY').add(1, 'day').format('MMDDYYYY')
            };
			counts.food = 0;
			counts.activity = 0;
			cache.food = new Cache();
			cache.exercise = new Cache();
			$q.all([getLog(), getDog()]).then(function () {
				angular.element(document.querySelector('#dogPhoto')).bind('change', uploadFile);
			});
			getActivities(); 
			getFoods();
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
			return logService.getLog(vm.dogId, currentDay).then(function (response) {
				vm.log = response;
				vm.pieChart.food.total = response.dailyCalories;
				counts.exercise = _.keys(vm.log.exercise).length;
				counts.food = _.keys(vm.log.food).length;
			});
		}

		function getDog() {
			vm.dog = logService.getDog(vm.dogId).then(function (response) {
				return response;
			});
		}

		function getActivities() {
			vm.activities = logService.getActivities().then(function (response) {
				return response;
			});
		}
		function getFoods() {
			vm.foods = logService.getFoods().then(function (response) {
				return response;
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
						Notification({
							message: response.message,
							status: response.status
						});
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
			vm.log[type][counts[type]++] = {
				edited: true,
				new: true
			};
		}

		function deleteLog(type, n) {
			counts[type]--;
			var log = vm.log[type][n];
			if (type === 'food') {
				vm.totalCalories -= log.calories;
			} else if (type === 'exercise') {
				vm.totalDuration -= log.duration;
			}
			logService.deleteLog(type, log.id).then(function () {
				delete vm.log[type][n];
				updateLog(type);
			});
		}

		function updateLog(type) {
			if (deleteableLog()) {
				logService.deleteLog('log', vm.log.id);
			} else if (type && vm.log.id) {
				logService.updateLog(type, vm.dogId, currentDay, vm.log);
			}
		}

		function saveLog(type, index) {
			logService.saveLog(type, vm.dogId, currentDay, vm.log[type][index]).then(function (response) {
				delete vm.log[type][index].edited;
				delete vm.log[type][index].new;
				vm.log[type][index] = response;
				if (type === 'exercise') {
					calculateDuration(); 
				}
				logService.updateLog(type, vm.dogId, currentDay, vm.log).then(function (response) {
					angular.merge(vm.log, response);
				});
			}, function (error) {
				if (error.message) {
					Notification({
						message: error.message,
						status: error.status
					});
				} 
			});
		}

		function calculateCalories(n) {
			var oldCalories = vm.log.food[n].calories || 0,
				food = _.find(vm.foods, function (food) {
					return food.id == vm.log.food[n].foodId;
				});
			vm.log.food[n].calories = food.calories * (vm.log.food[n].amount || 0) / food.serving;
			vm.log.totalCalories += vm.log.food[n].calories - oldCalories;
		}

		function calculateDuration(n) {
			vm.log.totalDuration = 0;
			_.each(vm.log.exercise, function (exercise) {
				vm.log.totalDuration += exercise.duration;
			});
		}

		function capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		
		function editWeight() {
			vm.log.edit = true;
			$timeout(function () {
				document.querySelector('#weight').focus();
			});
		}

		function saveWeight() {
			delete vm.log.edit;
			if (deleteableLog()) {
				logService.deleteLog('log', vm.log.id);
			} else {
				logService.updateWeight(vm.dogId, currentDay, vm.log).then(function (response) {
					angular.merge(vm.log, response);
				});
				if (moment(currentDay).isSame(today)) {
					logService.updateDog(vm.dogId, {weight: vm.log.weight});
				}
			}
		}

		function next() {
			var idx = _.indexOf(vm.views, vm.view) + 1;
			if (idx === vm.views.length) {
				vm.view = vm.views[0];
			} else {
				vm.view = vm.views[idx];
			}
		}

		function prev() {
			var idx = _.indexOf(vm.views, vm.view) - 1;
			if (idx < 0) {
				vm.view = vm.views[vm.views.length - 1];
			} else {
				vm.view = vm.views[idx];
			}
		}

		function uploadFile(event) {
			vm.log.image = event.target.files[0];
			upload.readAsDataUrl(vm.log.image, vm).then(function(result) {
				vm.log.imageUrl = result;
			});
			logService.updateImage(vm.dogId, currentDay, vm.log).then(function (response) {
				if (!response.message) {
					angular.merge(vm.log, response);
				} else {
					Notification({
						message: response.message,
						status: response.status
					});
				}
			}, function (error) {
				if (response.message) {
					Notification({
						message: error.message,
						status: error.status
					});
				} 
			});
    	}

    	function deleteableLog() {
    		var noExercise = _.values(vm.log.exercise).length === 0,
				noFood = _.values(vm.log.food).length === 0,
				noWeight = !vm.log.weight;
			return noExercise && noFood && noWeight && vm.log.id;
    	}
	}
});
