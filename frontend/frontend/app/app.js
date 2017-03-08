angular.module('app', [
    'ngMaterial',
    'ngRoute',
]);

angular.module('app').controller('AppCtrl', [
    '$scope',
    function($scope) {
        console.log("Inside AppCtrl");
}]);