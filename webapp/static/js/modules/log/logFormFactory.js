define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('log.formFactory', [])
		.factory('logFormFactory', logFormFactory);
	function logFormFactory() {
		return {
			addNewForm: addNewForm
		};

		function addNewForm(type) {
			switch (type) {
				case 'activity':
				return addNewActivityForm();
				case 'food':
				return addNewFoodForm();
			}
		}
	    function addNewFoodForm() {
	    	return '' +
	    		'<div class="row">' +
			    	'<div class="col-xs-4">' + 
	                	'<input type="text" class="form-control" ng-model="vm.item.food" ng-change="vm.warning = false">' +                
		                '<span class="text-danger" ng-if="vm.warning">Please enter a food name</span>' +
			    	'</div>' +
			    	'<div class="col-xs-4">' + 
			    		'<div class="input-group">' +
			                '<input type="number" class="form-control" min="0" ng-model="vm.item.cal">' +
			                '<div class="input-group-addon">cal/serving</div>' +
		            	'</div>' +
		            '</div>' +
		            '<div class="col-xs-4">' + 
			    		'<div class="input-group">' +
			                '<input type="number" class="form-control" min="0" ng-model="vm.item.serving">' +
			                '<div class="input-group-addon">oz/serving</div>' +
		            	'</div>' +
		            '</div>' +
	            '</div>';
	    }

	    function addNewActivityForm() {
	    	return '' +
	    		'<div class="row">' +
					'<div class="col-xs-6">' + 
		                '<input type="text" class="form-control" ng-model="vm.item.activity" placeholder="Ex: Run" ng-change="vm.warning = false">' +
		                '<span class="text-danger" ng-if="vm.warning">Please enter an activity name</span>' +
		            '</div>' +
		            '<div class="col-xs-6">' + 
		                '<input type="text" class="form-control" ng-model="vm.item.description" placeholder="Ex: 4 mph (15 min/mile)">' +
		            '</div>' +
	            '</div>' ;
	    }
	}
	
});