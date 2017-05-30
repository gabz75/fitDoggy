define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('log.service', ['common.service'])
		.service('logService', logService);

	logService.$inject = ['$q', 'httpService'];
	function logService($q, httpService) {
		this.getLog = getLog;
		this.getDog = getDog;
		this.getActivities = getActivities;
        this.getFoods = getFoods;

        this.addNew = addNew;
        this.saveLog = saveLog;
        this.deleteLog = deleteLog;
        this.updateLog = updateLog;

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

        function saveLog(type, id, date, log) {
        	if (type === 'exercise') {
        		return saveExerciseLog(id, date, log);
        	} else if (type === 'food') {
        		return saveFoodLog(id, date, log);
        	}
        }

        function saveExerciseLog(id, date, log) {
        	return httpService.post('/log/exercise/update', {
                exerciseLog: log,
        		id: id,
                date: date
        	});
        }

        function saveFoodLog(id, date, log) {
        	return httpService.post('/log/food/update', {
                foodLog: log,
        		id: id,
                date: date
        	});
        }

        function addNew(type, params) {
        	if (type === 'activity') {
        		return addNewActivity(params.activity, params.description);
        	} else if (type === 'food') {
        		return addNewFood(params.food, params.cal, params.serving);
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

        function deleteLog(type, id) {
            if (type === 'exercise') {
                return httpService.post('/log/exercise/delete', {
                    id: id
                }); 
            } else if (type === 'food') {
                return httpService.post('/log/food/delete', {
                    id: id
                }); 
            } else if (type === 'log') {
                return httpService.post('/log/delete', {
                    id: id
                });
            } else {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        }

        function updateLog(dogId, date, log) {
            var updated = {
                weight: log.weight,
                totalCalories: log.totalCalories,
                totalDuration: log.totalDuration,
                id: log.id
            };
            return httpService.post('log/update', {
                dogId: dogId,
                date: date,
                updated: updated
            });
        }
	}
});
