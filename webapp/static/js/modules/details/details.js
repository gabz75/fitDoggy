define([
	'angular',
	'modules/details/detailsCtrl',
	'modules/details/detailsService'
], function (angular) {
	'use strict';

	angular.module('details', [
		'details.controller', 
		'details.service'
	]);

});
