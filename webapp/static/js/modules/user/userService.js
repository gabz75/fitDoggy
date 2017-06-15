define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('user.service', ['ngCookies', 'common.service'])
		.service('userService', userService);

	userService.$inject = ['$q', '$cookies', 'httpService'];
	function userService($q, $cookies, httpService) {
		this.register = register;
		this.login = login;
		this.demo = demo;

		function register(username, password, email) {
			return httpService.upload('/user/new', {
				username: username,
				password: password,
				email: email
			}).then(function (response) {
				saveCookie('user', response);
				return response;
			});
		}

		function login(username, password, remember) {
			return httpService.upload('/user/login', {
				username: username,
				password: password,
				remember: remember || false
			}).then(function (response) {
				saveCookie('user', response);
				return response;
			});
		}

		function demo() {
			return httpService.upload('/user/login', {
				username: 'demo',
				password: 'demo',
				remember: false
			}).then(function (response) {
				saveCookie('demo', response);
			});
		}

		function saveCookie(type, response) {
			var cookieExp = new Date();
			cookieExp.setDate(cookieExp.getDate() + 7);
			$cookies.put(type, 'true', {expires: cookieExp});
		}
	}
});
