define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('log.service', ['common.service'])
		.service('logService', logService);

	logService.$inject = ['httpService'];
	function logService(httpService) {
		this.getLog = getLog;
		this.getDog = getDog;
		this.getActivities = getActivities;
        this.getFoods = getFoods;

        this.addNew = addNew;
        this.saveLog = saveLog;

		function getLog(id, date) {			
			return httpService.post('/log', {
				id: id,
				date: date
			}).then(function (response) {
				response.exercise = toObject(response.exercise);
				response.food = toObject(response.food);
				return response;
			});
		}

		function toObject(arr) {
			var obj = {};
			_.forEach(arr, function (val, index) {
				obj[index] = val;
			});
			return obj;
		}

		function getDog(id) {
			return httpService.post('/dog', {
				id: id
			});
		}

        function getActivities() {
            return httpService.post('/exercise/all', {});
        }

        function getFoods() {
            return httpService.post('/food/all', {});
        }

        function saveLog(type, id, log) {
        	if (type === 'exercise') {
        		return saveExerciseLog(id, log);
        	} else if (type === 'food') {
        		return saveFoodLog(id, log);
        	}
        }

        function saveExerciseLog(id, log) {
        	return httpService.post('/log/exercise/update', {
        		id: id,
        		exerciseLog: log
        	});
        }

        function saveFoodLog(id, log) {
        	return httpService.post('/log/food/update', {
        		id: id,
        		foodLog: log
        	});
        }

        function addNew(type, params) {
        	if (type === 'activity') {
        		return addNewActivity(params.activity, params.description);
        	} else if (type === 'food') {
        		return addNewFood(params.food, params.calories, params.serving);
        	}
        }

        function addNewActivity(activity, description) {
            return httpService.post('/exercise/new', {
                activity: activity,
                description: description
            });
        }

        function addNewFood(food, calories, serving) {
            return httpService.post('/food/new', {
                food: food,
                calories: calories,
                serving: serving
            });
        }
	}
});
