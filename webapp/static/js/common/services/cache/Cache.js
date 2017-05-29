define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('common.cache', [])
		.factory('Cache', Cache);

	function Cache() {
		Cache.prototype.setData = setData;
		Cache.prototype.getData = getData;

		return Cache;

		function Cache(options) {
			options = options || {};
			this.size = 0;
			this.MAX_SIZE = options.size || 50;
			this.storage = {};
			this.lru = [];
		}

		function setData(value, key) {
			var self = this;
			if (!key && Array.isArray(value)) {
				_.forEach(value, function (val, index) {
					storage[val.id] = val;
					self.lru.push(val.id);
					self.size++;
				});
				if (self.MAX_SIZE < self.size) {
					self.MAX_SIZE = self.size;					
				}
			} else {
				if (self.size > self.MAX_SIZE) {
					var lru = self.lru[0];
					delete self.storage[lru];
					self.lru.splice(0, 1);
				}
				self.storage[key] = value;
				self.size = self.size + 1 < self.MAX_SIZE ? self.size + 1 : self.MAX_SIZE;
				self.lru.push(key);
			}
		}

		function getData(key) {
			var self = this,
				index = _.indexOf(self.lru, key);
			if (index !== self.lru.length - 1) {
				self.lru = _.without(self.lru, key);
				self.lru.push(key);
			}
			return self.storage[key];
		}
	}
});
