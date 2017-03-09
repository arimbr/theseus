angular.module('app').controller('DashboardCtrl', function($scope) {
    $scope.degrees = [];
    $scope.degree = {};
    $scope.topics = [];
    $scope.topic = {};

    d3.json('app/components/dashboard/degrees.json', function(data) {
        $scope.degrees = data;
        console.log(data);
        $scope.$apply();
        // check https://gist.github.com/vicapow/9496218
    });

    d3.json('app/components/dashboard/topics.json', function(data) {
        $scope.topics = data;
        console.log(data);
        $scope.$apply();
        // check https://gist.github.com/vicapow/9496218
    });
});