define([
    'angular',
    'moment'
], function (angular, moment) {
    'use strict';

    angular.module('updateDog.service', ['common.service'])
        .service('updateDogService', updateDogService);

    updateDogService.$inject = ['httpService'];
    function updateDogService(httpService) {
        this.updateDog = updateDog;
        this.getDog = getDog;

        function updateDog(dog) {
            dog.birthday = moment(dog.birthdate).format('MMDDYYYY');
            if (!dog.id) {
                return addNewDog(dog);
            }
            return httpService.upload('/dog/update', dog);
        }

        function addNewDog(dog) {
            return httpService.upload('/dog/new', dog);
        }

        function getDog(id) {
            return httpService.post('/dog', {
                id: id,
            });
        }
    }
});
