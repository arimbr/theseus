angular.module('app').config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');

        $routeProvider.when('/', {
            // TODO: add router inside components.home ?
            templateUrl: 'app/components/home/home.html',
            controller: 'HomeCtrl',
        })
        .when('/dashboard', {
            templateUrl: 'app/components/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            reloadOnSearch: false,
        });
}]);