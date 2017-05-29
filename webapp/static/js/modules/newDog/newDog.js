define([
	'angular',
	'modules/newDog/newDogCtrl',
	'modules/newDog/newDogService'
], function (angular) {
	'use strict';

	angular.module('newDog', [
		'newDog.controller', 
		'newDog.service'
	]);

});
