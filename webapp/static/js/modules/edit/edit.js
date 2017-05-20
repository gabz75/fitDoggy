define([
	'angular',
	'modules/edit/editCtrl',
	'modules/edit/editService'
], function (angular) {
	'use strict';

	angular.module('edit', [
		'edit.controller', 
		'edit.service'
	]);

});
