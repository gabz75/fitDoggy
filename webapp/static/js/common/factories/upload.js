define([
    'angular',
    'moment'
], function (angular, moment) {
    'use strict';

    angular.module('common.upload', [])
        .factory('upload', upload);
    upload.$inject = ['$q', '$log'];
    function upload($q, $log) {
        return {
            readAsDataUrl: readAsDataURL  
        };

        function onLoad(reader, deferred, $scope) {
            return function () {
                deferred.resolve(reader.result);
            };
        }
 
        function onError(reader, deferred, $scope) {
            return function () {
                deferred.reject(reader.result);
            };
        }
 
        function getReader(deferred, $scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, $scope);
            reader.onerror = onError(reader, deferred, $scope);
            return reader;
        }
 
        function readAsDataURL(file, $scope) {
            var deferred = $q.defer(),
                reader = getReader(deferred, $scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        }
    }
})