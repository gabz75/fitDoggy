define([
	'angular',
	'modules/home/homeCtrl',
    'modules/home/homeService',
	'modules/home/quotes'
], function (angular) {
	'use strict';

	angular.module('home', [
		'home.controller', 
		'home.service',
        'home.quotes'
	]);

});
