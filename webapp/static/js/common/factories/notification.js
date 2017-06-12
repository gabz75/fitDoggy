define([
    'angular',
    'lodash'
], function (angular, _) {
    'use strict';

    angular.module('common.notification', [])
        .factory('Notification', Notification);

    Notification.$inject = ['$timeout'];
    function Notification($timeout) {
        var notifications = {},
            index = 0;
        return Notification;

        function Notification(options) {
            if (!options.message) {
                console.error('Message is required');
                return;
            }
            if (!options.$scope) {
                console.error('Scope is required');
                return;
            }
            options.status = options.status || 'info';
            options.position = options.position || 'top right';
            var id = 'notification' + index,
                notif = '' +
                    '<div id="' + id + '" class="notification ' + options.status + ' ' + options.position + '" >' +
                        options.message +
                    '</div>';
            notifications[index] = notif;
            angular.element(document.querySelector('body')).append(notif);
            var notifElem = angular.element(document.querySelector('#' + id));
            if (options.length) {
                $timeout(function () {
                    notifElem.remove();
                }, options.length * 1000);
            }     
            notifElem.bind('click', function () {
                notifElem.remove();
            });
            index++;
        }
    }
});
