define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('common.cacheService', ['common.cache'])
		.service('cacheService', cacheService);

	cacheService.$inject = ['Cache'];
	function cacheService(Cache) {
		var _dogs = new Cache(),
			_weights = new Cache(),
			_exercises,
			_foods,
			getMap = {
				'/dog': getDog,
				'/dog/weights': getWeight,
				'/exercise/all': getExercises,
				'/food/all': getFoods
			}, 
			setMap = {
				'/dog': setDogs,
				'/dog/weights': setWeight,
				'/exercise/all': setExercises,
				'/exercise/new': updateExercises,
				'/food/all': setFoods,
				'/food/new': updateFoods
			};
		this.get = get;
		this.set = set;
		this.setDogs = setDogs;
		this.getDog = getDog;
		this.getWeight = getWeight;
		this.setWeight = setWeight;

		function setDogs(queryParams, data) {
			_dogs.setData(data);
		}

		function getDog(queryParams) {
			return _dogs.getData(queryParams.id);
		}

		function getWeight(queryParams) {
			return _weights.getData(queryParams.startDate + '_' + queryParams.endDate);
		}

		function setWeight(queryParams, data) {
			_weights.setData(data, queryParams.startDate + '_' + queryParams.endDate);
		}

		function getExercises() {
			return _exercises;
		}

		function setExercises(queryParams, data) {
			_exercises = data;
		}

		function updateExercises(queryParams, data) {
			_exercises.push(data);
		}

		function getFoods() {
			return _foods;
		}

		function setFoods(queryParams, data) {
			_foods = data;
		}

		function updateFoods(queryParams, data) {
			_foods.push(data);
		}

		function get(url, queryParams) {
			var result;
			if (!getMap[url]) {
				return result;
			}
			
			return getMap[url](queryParams);
		}

		function set(url, queryParams, data) {
			if (!setMap[url]) {
				return ;
			}
			setMap[url](queryParams, data);
		}
	}
});
