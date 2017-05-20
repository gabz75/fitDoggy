define([
    'angular',
    'lodash',
    'modules/edit/editService'
], function (angular, _) {
    'use strict';

    angular.module('edit.controller', ['edit.service'])
    .controller('editCtrl', editCtrl);

    editCtrl.$inject = ['$location', 'editService'];
    function editCtrl($location, editService) {
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
                detailsService.addNewDog(vm.dogData).then(function (response) {
                    console.log(response);
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
