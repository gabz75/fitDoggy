define([
    'angular',
    'moment',
    'lodash'
], function (angular, moment, lodash) {
    'use strict';

    angular.module('updateDog.controller', ['common.dialog', 'common.upload', 'updateDog.service'])
        .controller('updateDogCtrl', updateDogCtrl);

    updateDogCtrl.$inject = ['$location', 'upload', 'dialog', 'updateDogService'];
    function updateDogCtrl($location, upload, dialog, updateDogService) {
        var vm = this;

        vm.fileTypes = '.jpeg, .jpg, .png, .gif, image/jpeg, image/pjpeg, image/jpeg, image/pjpeg, image/png, image/gif';
        vm.updateDog = updateDog;
        vm.deletePhoto = deletePhoto;
        vm.cancelChanges = cancelChanges;
        vm.dogData = {
            metric: 'lb'
        };
        vm.warning = {};

        init();

        function init() {
            if (_.last($location.url().split('/')) !== 'new') {
                updateDogService.getDog().then(function (response) {
                    angular.merge(vm.dogData, response);
                    vm.dogData.birthdate = new Date(response.birthday);
                });
            }
            angular.element(document.querySelector('#dogPhoto')).bind('change', uploadFile);    
        }

        function updateDog() {
            if (!invalidData()) {
                updateDogService.updateDog(vm.dogData).then(function (response) {
                    if (response.id) {
                        $location.path('/dog/' + response.id + '/date/' + moment().format('MMDDYYYY'))
                    }
                }, function (error) {
                    dialog.error(error);
                });
            }
        }

        function cancelChanges() {
            if (_.last($location.url().split('/')) === 'new') {
                $location.path('/home');
            } else {
                var path = $location.path().match(/\/dog\/\d+/)[0];
                $location.path(path);
            }
        }

        function invalidData() {
            vm.warning.name = !vm.dogData.name;
            vm.warning.birthday = !vm.dogData.birthdate;
            vm.warning.current = !vm.dogData.current; 
            vm.warning.goal = !vm.dogData.goal;
            return vm.warning.name || vm.warning.birthday || vm.warning.current || vm.warning.goal;
        }

        function deletePhoto() {
            vm.dogData.image_url = void 0;
        }

        
        function uploadFile(event) {
            vm.dogData.image = event.target.files[0];
            upload.readAsDataUrl(vm.dogData.image, vm).then(function(result) {
                vm.dogData.imageUrl = result;
            });
        }
    }
});
