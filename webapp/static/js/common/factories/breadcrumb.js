define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('common.breadcrumb', [])
        .factory('breadcrumb', breadcrumb);

    breadcrumb.$inject = ['$rootScope', '$location'];

    function breadcrumb($rootScope, $location) {
        var previous = 'Home',
            previousUrl = '/home';

        init();

        return {
            getPrevious: getPrevious,
            setPrevious: setPrevious   
        }

        function init() {
            $rootScope.$on('$locationChangeStart', function () {
                console.log($location.path());
                setPrevious('Back', $location.path());
            });
        }

        function getPrevious() {
            return {
                label: previous,
                url: previousUrl
            };
        }

        function setPrevious(previous, previousUrl) {
            previous = previous;
            previousUrl = previousUrl;
        }
    }
});
