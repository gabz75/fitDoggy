define([
    'angular',
    'modules/user/userCtrl',
    'modules/user/userService'
], function (angular) {
    'use strict';

    angular.module('user', [
        'user.controller', 
        'user.service'
    ]);

});
