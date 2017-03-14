angular.module('app').controller('DashboardCtrl', [
    '$scope',
    'config',
    'Count',
    function($scope, config, Count) {
        $scope.degrees = [];
        $scope.degree = {};
        $scope.topics = [];
        $scope.topic = {};

        console.log(config);

        d3.json('app/components/dashboard/most_popular_degrees.json', function(data) {
            $scope.degrees = data;
            console.log(data);
            //$scope.$apply();
            // check https://gist.github.com/vicapow/9496218
        });

        //d3.json('app/components/dashboard/topics.json', function(data) {
        //    $scope.topics = data;
        //    console.log(data);
        //    $scope.$apply();
        //    // check https://gist.github.com/vicapow/9496218
        //});
        Count.query({'group': 'topics', 'limit': 23}, function(data) {
            $scope.topics = data;
            console.log(data);
            //$scope.$apply();
        });

        $scope.$watch('degree', function(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('Updated topics in controller');
                console.log(newVal);

                Count.query({
                    'group': 'topics',
                    'limit': 23,
                    'where': {'collections': newVal.degree_id}
                }, function(data) {
                    $scope.topics = data;
                    console.log(data);
                    //$scope.$apply();
                })
            };
        });
}]);