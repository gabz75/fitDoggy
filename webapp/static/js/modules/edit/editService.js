define(['angular'], function (angular) {
    'use strict';

    angular.module('edit.service', [])
        .service('editService', editService);

    editService.$inject = ['$http'];
    function editService($http) {
        this.addNewDog = addNewDog;

        function addNewDog(dog) {
            return $http({
                method: 'POST',
                url: '/dog/new',
                data: dog
            }).then(function (response) {
                if (response.status !== 'ERROR') {
                    return response.data;
                }
            }, function (error) {
                //openErrorModal(error);
                return error;
            });
        }
    }
});
