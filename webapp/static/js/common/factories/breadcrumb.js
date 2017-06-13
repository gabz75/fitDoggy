define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('common.breadcrumb', [])
        .factory('breadcrumb', breadcrumb);

    breadcrumb.$inject = ['$rootScope', '$location'];

    function breadcrumb($rootScope, $location) {
        var label = 'Home',
            url = '#!/home';

        init();

        return {
            getPrevious: getPrevious,
            setPrevious: setPrevious   
        }

        function init() {
            $rootScope.$on('$locationChangeStart', function (event, current, previous) {
                setPrevious('Back', new URL(previous).hash);
            });
        }

        function getPrevious() {
            return {
                label: label,
                url: url
            };
        }

        function setPrevious(previous, previousUrl) {
            label = previous;
            url = previousUrl;
        }

        function getLocation(href) {
            var temp = document.createElement("a");
            temp.href = href;
            return temp;
        }
    }
});
