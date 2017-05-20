define([
	'angular',
	'lodash',
	'rx'
], function (angular, _, rx) {
	'use strict';

	angular.module('common.cache', [])
		.service('cache', cache);

	cache.$inject = [];
	function cache() {
		var dogs = {};

		this.getDogs = getDogs;
		this.setDogs = setDogs;
		this.getDog = getDog;

		function getDogs() {
			return dogs;
		}

		function setDogs(data) {
			dogs = data;
		}

		function getDog(id) {
			return dogs[id];
		}

	}
});
