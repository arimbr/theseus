angular.module('app', [
    'ngMaterial',
    'ngRoute',
    'ngResource',
]);

angular.module('app').constant('config', {
    // TODO: set as environment variable
    apiUrl: 'http://localhost:5000/'
});

angular.module('app').controller('AppCtrl', [
    '$scope',
    function($scope) {
        console.log("Inside AppCtrl");
}]);