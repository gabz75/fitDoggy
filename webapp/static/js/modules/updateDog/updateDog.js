define([
	'angular',
	'modules/updateDog/updateDogCtrl',
	'modules/updateDog/updateDogService'
], function (angular) {
	'use strict';

	angular.module('updateDog', [
		'updateDog.controller', 
		'updateDog.service'
	]);

});
