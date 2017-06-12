define([
	'angular',
	'bcrypt'
], function (angular, bcrypt) {
	'use strict';

	angular.module('user.service', ['ngCookies', 'common.service'])
		.service('userService', userService);

	userService.$inject = ['$q', '$cookies', 'httpService'];
	function userService($q, $cookies, httpService) {
		const salt = bcrypt.genSaltSync(10);
		this.register = register;
		this.login = login;
		this.demo = demo;

		function register(username, password, email) {
			var deferred = $q.defer();

			bcrypt.hash(password, salt, function(err, hash) {
				if (!err) {
					httpService.upload('/user/new', {
						username: username,
						password: hash,
						email: email
					}).then(function (response) {
						saveCookie('user', response);
						deferred.resolve(response);
					});
				} else {
					return {
						'message': err
					}
				}
			});
			return deferred.promise;
		}

		function login(username, password, remember) {
			var deferred = $q.defer();
			bcrypt.hash(password, salt, function (err, hash) {
				if (!err) {
					httpService.upload('/user/login', {
						username: username,
						password: hash,
						remember: remember || false
					}).then(function (response) {
						saveCookie('user', response);
						deferred.resolve(response);
					});
				} else {
					deferred.resolve({
						'message': err
					});
				}
			});
			return deferred.promise;
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
