angular.module('app').controller('DashboardCtrl', function($scope) {
    $scope.degrees = [];
    $scope.degree = {};

    d3.json('app/components/dashboard/data.json', function(data) {
        $scope.degrees = data;
        console.log(data);
        $scope.$apply();
        // check https://gist.github.com/vicapow/9496218
    })
});