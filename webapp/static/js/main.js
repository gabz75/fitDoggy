requirejs.config({
    baseUrl: '../static/js',
    paths: {
        'angular': '/static/node_modules/angular/angular.min',
        'domReady': '/static/node_modules/requirejs-domready/domReady',
        'uiRouter': '/static/node_modules/angular-ui-router/release/angular-ui-router.min',
        'ng-flow': '/static/node_modules/ng-flow/dist/ng-flow.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
        },
         'uiRouter':{
            deps: ['angular']
        }
    },

    deps: ['./bootstrap']
});