angular.module('app').controller('DashboardCtrl', [
    '$scope',
    'config',
    'Count',
    'DegreeCount',
    function($scope, config, Count, DegreeCount) {
        $scope.degrees = [];

        $scope.degree_counts = [];
        $scope.topic_counts = [];

        $scope.degree = {};
        $scope.topic = {};

        //d3.json('app/components/dashboard/most_popular_degrees.json', function(data) {
        //    $scope.degree_counts = data;
        //    console.log(data);
        //    //$scope.$apply();
        //    // check https://gist.github.com/vicapow/9496218
        //});
        //d3.json('app/components/dashboard/topics.json', function(data) {
        //    $scope.topics = data;
        //    console.log(data);
        //    $scope.$apply();
        //    // check https://gist.github.com/vicapow/9496218
        //});
        DegreeCount.query({}, function(data) {
            $scope.degree_counts = data;
            console.log(data);
        });

        Count.query({'group': 'topics', 'limit': 28}, function(data) {
            $scope.topic_counts = data;
            console.log(data);
            //$scope.$apply();
        });

        $scope.$watch('degree', function(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('Updating topics in controller');
                console.log(newVal);

                Count.query({
                    'group': 'topics',
                    'limit': 28,
                    'where': {'degree.id': newVal._id}
                }, function(data) {
                    $scope.topic_counts = data;
                    console.log(data);
                    //$scope.$apply();
                })
            };
        });

        $scope.$watch('topic', function(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('Updating degrees in controller');
                console.log(newVal);

                DegreeCount.query({
                    'where': {'topics': newVal._id}
                }, function(data) {
                    $scope.degree_counts = data;
                    console.log(data);
                });
            };
        });
}]);