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
            return httpService.upload('/dog/update', dog);
        }

        function getDog(id) {
            return httpService.post('/dog', {
                id: id,
            });
        }
    }
});
