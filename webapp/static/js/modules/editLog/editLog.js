define([
	'angular',
	'modules/editLog/editLogCtrl',
	'modules/editLog/editLogFormFactory',
	'modules/editLog/editLogService'
], function (angular) {
	'use strict';

	angular.module('editLog', [
		'editLog.controller', 
		'editLog.service',
		'editLog.formFactory'

	]);

});
