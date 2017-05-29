define([
    'angular',
    'moment'
], function (angular, moment) {
    'use strict';

    angular.module('newDog.controller', ['common.dialog', 'newDog.service'])
        .controller('newDogCtrl', newDogCtrl);

    newDogCtrl.$inject = ['$location', 'dialog', 'newDogService'];
    function newDogCtrl($location, dialog, newDogService) {
        var vm = this,
        fileTypes = {
            png:1,
            gif:1,
            jpg:1,
            jpeg:1
        },
        flowOptions = {
            singleFile:true
        };

        vm.addNewDog = addNewDog;
        vm.deletePhoto = deletePhoto;
        vm.uploadPhoto = uploadPhoto;
        vm.dogData = {
            metric: 'kg'
        };
        vm.warning = {};

        function flowFileAdded(extension) {
            return !!fileTypes[extension];
        }

        function addNewDog() {
            if (!invalidData()) {
                newDogService.addNewDog(vm.dogData).then(function (response) {
                    $location.path('/dog/' + response.id + '/date/' + moment().format('MMDDYYYY'))
                }, function (error) {
                    dialog.error(error);
                });
            }
        }

        function invalidData() {
            vm.warning.name = !vm.dogData.name;
            vm.warning.birthday = !vm.dogData.birthday;
            vm.warning.current = !vm.dogData.current; 
            vm.warning.goal = !vm.dogData.goal;
            return vm.warning.name || vm.warning.birthday || vm.warning.current || vm.warning.goal;
        }

        function getFileReader() {
            var fileReader = new FileReader();
            fileReader.onloadend = function() {
                vm.dogData.image = fileReader.result;
            }
            return fileReader;
        }

        function deletePhoto() {

        }

        function uploadPhoto() {
            console.log(vm.dogData.image);
        }
    }
});
