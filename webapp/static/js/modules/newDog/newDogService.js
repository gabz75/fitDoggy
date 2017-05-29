define(['angular'], function (angular) {
    'use strict';

    angular.module('newDog.service', ['common.service'])
        .service('newDogService', newDogService);

    newDogService.$inject = ['httpService'];
    function newDogService(httpService) {
        this.addNewDog = addNewDog;

        function addNewDog(dog) {
            return httpService.post('/dog/new', dog);
        }
    }
});
