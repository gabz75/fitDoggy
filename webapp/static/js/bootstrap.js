define([
    'require',
    'angular',
    'app',
    '../node_modules/requirejs-domready/domReady',
], function (require, angular) {
    'use strict';

    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['app']);
    });
});