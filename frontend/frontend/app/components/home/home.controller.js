angular.module('app').controller('HomeCtrl', [
    '$scope',
    '$location',
    'Count',
    function($scope, $location, Count) {

        $scope.goDashboard = function () {
            $location.path('/dashboard');
        }

        $scope.counts = Count.get();
    }
]);