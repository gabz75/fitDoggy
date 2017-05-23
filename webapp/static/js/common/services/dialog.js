define([
	'angular',
    'lodash',
	'ui-bootstrap'
], function (angular, _) {
	'use strict';

	angular.module('common.dialog', ['ui.bootstrap'])
		.service('dialog', dialog);

	dialog.$inject = ['$uibModal'];
	function dialog($uibModal) {
        this.popup = popup;
        this.error = error;
		
		var defaultModalOptions = {
            windowTemplateUrl: 'static/js/common/services/dialog/window.html',
			templateUrl: 'static/js/common/services/dialog/alert.html',
			controllerAs: 'vm',
            backdrop: 'static',
            modalFade: true
        }, defaultModalResolve = {
        	closeButtonText: 'Cancel',
        	actionButtonText: 'OK',
            buttons: []
        };


        function popup(modalOptions, modalResolve) {
            var _modalOptions = {},
            	_modalResolve = {};

            angular.extend(_modalOptions, defaultModalOptions, modalOptions);
            angular.extend(_modalResolve, defaultModalResolve, modalResolve);

            if (!_modalOptions.controller) {
                _modalOptions.controller = modalController(_modalResolve);
            }

            return $uibModal.open(_modalOptions);
        }

        function error(errorMessage) {
            var _modalResolve = {
                    title: 'Error',
                    message: errorMessage,
                    buttons: [{
                        label: 'Dismiss',
                        cssClass: 'btn-danger'
                    }]
                }, _modalOptions = {
                    controller: modalController(_modalResolve)
                };
            angular.extend(_modalOptions, defaultModalOptions);
            return $uibModal.open(_modalOptions);
        }

        function modalController(_modalResolve) {
        	return function ($uibModalInstance) {
        		var vm = this;
                vm.close = close;
                vm.modalOptions = _modalResolve;

                _.each(vm.modalOptions.buttons, function (button) {
                    if (!button.actionCallback || typeof button.actionCallback !== 'function') {
                        button.actionCallback = close;
                    } else {
                        button.actionCallback = closeActionCallback(button.actionCallback);
                    }
                });

                function close(actionCallback) {
                    $uibModalInstance.close();
                }

                function closeActionCallback(actionCallback) {
                    return function () {
                        $uibModalInstance.close();
                        actionCallback();
                    }
                }
        	}
        }
	}
});
