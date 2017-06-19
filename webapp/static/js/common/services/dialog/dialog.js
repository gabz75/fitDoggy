define([
	'angular',
    'lodash',
	'ui-bootstrap'
], function (angular, _) {
	'use strict';

	angular.module('common.dialog', ['ui.bootstrap'])
		.service('dialog', dialog);

	dialog.$inject = ['$compile', '$uibModal'];
	function dialog($compile, $uibModal) {
        this.popup = popup;
        this.error = error;
		
		var defaultModalOptions = {
            windowTemplateUrl: '/static/js/common/services/dialog/window.html',
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
            if (!modalOptions.templateUrl && !modalOptions.template) {
                _modalOptions.templateUrl = '/static/js/common/services/dialog/popup.html';
            }

            angular.extend(_modalOptions, defaultModalOptions, modalOptions);
            angular.extend(_modalResolve, defaultModalResolve, modalResolve);

            if (!_modalOptions.controller) {
                _modalOptions.controller = modalController(_modalResolve);
            } else if (_modalOptions.controller === 'lightbox') {
                _modalOptions.controller = lightbox(_modalResolve);
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
                    templateUrl:'/static/js/common/services/dialog/popup.html',
                    controller: modalController(_modalResolve)
                };
            angular.extend(_modalOptions, defaultModalOptions);
            return $uibModal.open(_modalOptions);
        }

        function warning(warningMessage) {
            var _modalResolve = {
                    title: 'Warning',
                    message: warningMessage,
                    buttons: [{
                        label: 'Dismiss',
                        cssClass: 'btn-warning'
                    }]
                }, _modalOptions = {
                    templateUrl:'/static/js/common/services/dialog/popup.html',
                    controller: modalController(_modalResolve)
                };
            angular.extend(_modalOptions, defaultModalOptions);
            return $uibModal.open(_modalOptions);
        }

        function modalController(_modalResolve) {
        	return function ($uibModalInstance, $scope, $compile) {
        		var vm = this;
                vm.close = close;
                vm.title = _modalResolve.title;
                vm.buttons = _modalResolve.buttons;
                vm.message = _modalResolve.message;
                vm.item = {};

                init();

                function init() {
                    if (vm.buttons) {
                        $uibModalInstance.rendered.then(renderFooter($scope, _modalResolve.buttons));
                    }
                    if (_modalResolve.messageTemplate) {
                        $uibModalInstance.rendered.then(renderBody($scope, _modalResolve.messageTemplate));
                    }
                }
            

                function close(actionCallback) {
                    $uibModalInstance.close();
                    if (actionCallback && typeof actionCallback === 'function') {
                        actionCallback(vm);
                    }
                }
        	}
        }

        function renderFooter($scope, buttons) {
            var buttonTemplates = '';
            _.each(buttons, function (button, index) {
                var template = '<button type="button" class="btn';
                if (button.cssClass) {
                    template += ' ' + button.cssClass;
                } 
                template += '" ng-click="vm.close(';
                if (typeof button.actionCallback === 'function') {
                    template += 'vm.buttons[' + index + '].actionCallback';
                } 
                template += ')"';
                if (button.ngDisabled) {
                    template += ' ng-disabled="vm.buttons[' + index + '].ngDisabled(vm)"';
                }
                template += '>' + button.label + '</button>';
                buttonTemplates += template;
            });
            return function () {
                angular.element(document.querySelector('.modal-footer'))
                    .append($compile(buttonTemplates)($scope));
            }
        }

        function renderBody($scope, template) {
            return function () {
                angular.element(document.querySelector('.modal-body'))
                    .append($compile(template)($scope));
            }
        }

        function lightbox(_modalResolve) {
            return function ($uibModalInstance, $scope, $compile) {
                var vm = this,
                    totalImages = _modalResolve.images.length;
                vm.close = close;
                vm.images = _modalResolve.images;
                vm.current = _modalResolve.current;
                vm.currentView = currentView;
                vm.nextView = nextView;
                vm.prevView = prevView;
                vm.currentIndex = 0;
                init();

                function init() {
                    _.forEach(vm.images, function (img, index) {
                        if (img.filename === vm.current.filename) {
                            vm.currentIndex = index;
                            console.log(index);
                            return;
                        }
                    });   
                }
                
                function currentView(img) {
                    return vm.current.filename !== img;
                }

                function nextView(img) {
                    vm.currentIndex++;
                    if (vm.currentIndex === totalImages) {
                        vm.currentIndex = 0;
                    }
                    vm.current = vm.images[vm.currentIndex];
                }

                function prevView(img) {
                    vm.currentIndex--;
                    if (vm.currentIndex < 0) {
                        vm.currentIndex = totalImages - 1;
                    }
                    vm.current = vm.images[vm.currentIndex];
                }
            

                function close(actionCallback) {
                    $uibModalInstance.close();
                }
            }
        }
	}
});
