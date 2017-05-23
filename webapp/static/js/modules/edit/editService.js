define(['angular'], function (angular) {
    'use strict';

    angular.module('edit.service', ['common.service'])
        .service('editService', editService);

    editService.$inject = ['httpService'];
    function editService($httpService) {
        this.addNewDog = addNewDog;

        function addNewDog(dog) {
            return httpService.post('/dog/new', {
                dog: dog
            }).then(function (response) {
                return response.data;
            }, function (error) {
                //openErrorModal(error);
                return error;
            });
        }
    }
});
