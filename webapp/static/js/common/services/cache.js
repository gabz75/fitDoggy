define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('common.cache', [])
		.service('cache', cache);

	function cache() {
		var dogs = {},
			map = {
				'/dog': getDog
			};
		this.get = get;
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

		function get(url, data) {
			var result;
			if (!map[url]) {
				return result;
			}
			_.forEach(data, function (value) {
				result = map[url](value) || result;
			});
			return result
		}
	}
});
