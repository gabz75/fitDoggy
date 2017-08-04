define([
	'angular',
	'modules/calendar/calendarCtrl',
    'modules/calendar/calendarService'
], function (angular) {
	'use strict';

	angular.module('calendar', [
		'calendar.controller', 
		'calendar.service'
	]);

});
