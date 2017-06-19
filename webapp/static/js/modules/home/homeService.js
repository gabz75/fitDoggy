define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('home.service', ['common.service', 'home.quotes'])
		.service('homeService', homeService);
	
	homeService.$inject = ['httpService', 'quotes'];
	function homeService(httpService, quotes) {
		this.getDogs = getDogs;
		this.getImages = getImages;
		this.logout = logout;
		this.getQuote = getQuote;

		function getDogs() {
			return httpService.post('/dog/all', {});
		}

		function getImages() {
			return httpService.post('/dog/images', {});
		}

		function logout() {
			return httpService.post('/user/logout', {});
		}

		function getQuote() {
		    var keys = _.keys(quotes),
		    	random = keys.length * Math.random() << 0,
		    	author = keys[random];
		    return {
		    	quote: quotes[author],
		    	author: author
		    };
		}
	}
});
