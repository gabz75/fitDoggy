angular.module('app', [
'ui.router'
])
.config(appConfig);

appConfig.$inject = ['$stateProvider'];
function appConfig($stateProvider) {
	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'index.html'
	})
	.state('daily', {
        url: '/daily/:day',
        templateUrl: '/modules/daily/dailyView.html',
        controller: 'dailyCtrl',
        controllerAs: 'vm'
    })
    .state('daily.edit', {
		url: '/daily/edit/:day',
        templateUrl: '/modules/edit/editView.html',
        controller: 'editCtrl',
        controllerAs: 'vm'
    })

}