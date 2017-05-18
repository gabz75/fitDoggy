define([
	'angular',
	'modules/home/homeCtrl',
	'modules/home/homeService'
], function (angular) {
	'use strict';

	angular.module('home', [
		'home.controller', 
		'home.service'
	]);

});
