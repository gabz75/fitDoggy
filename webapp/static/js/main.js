requirejs.config({
    baseUrl: '../static/js',
    paths: {
        'angular': '/static/node_modules/angular/angular.min',
        'lodash': '/static/node_modules/lodash/lodash',
        'dateformat': '/static/node_modules/dateformat/lib/dateformat',
        'domReady': '/static/node_modules/requirejs-domready/domReady',
        'ngRoute': '/static/node_modules/angular-route/angular-route.min',
        'ng-flow': '/static/node_modules/ng-flow/dist/ng-flow.min',
        'rx': '/static/node_modules/rx/dist/rx.min',
    },
    shim: {
        'angular': {
            exports: 'angular',
        },
        'ngRoute': {
            deps: ['angular']
        },
        'lodash': {
            deps: ['angular']
        }
    },

    deps: ['./bootstrap']
});