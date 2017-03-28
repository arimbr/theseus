angular.module('app').controller('HomeCtrl', [
    '$scope',
    '$location',
    function($scope, $location) {

        $scope.goDashboard = function () {
            $location.path('/dashboard');
        }
    }
]);