angular.module('app').controller('DashboardCtrl', [
    '$scope',
    '$window',
    'config',
    'Count',
    'DegreeCount',
    function($scope, $window, config, Count, DegreeCount) {

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

        // http://stackoverflow.com/questions/33303274/change-the-view-based-on-screen-size
        $scope.includeDesktopTemplate = false;
        $scope.includeMobileTemplate = false;
        var screenWidth = $window.innerWidth;

        if (screenWidth < 960){
            $scope.includeMobileTemplate = true;
        } else {
            $scope.includeDesktopTemplate = true;
        }

        $scope.init = function() {
            console.log("reseting dashboard");

            $scope.currentPage = 'page1';

            $scope.languages = ['Finnish', 'English', 'Swedish'];
            $scope.language = '';

            $scope.universities = ['Metropolia Ammatikorkeakoulu', 'Laurea Ammatikorkeakoulu'];
            $scope.university = '';

            $scope.degree_counts = [];
            $scope.topic_counts = [];
            $scope.degrees = [];
            $scope.topics = [];

            DegreeCount.query({}, function(data) {
                $scope.degree_counts = data;
            });

            Count.query({'group': 'topics', 'limit': 12}, function(data) {
                $scope.topic_counts = data;
                //$scope.$apply();
            });
        };

        $scope.$watchCollection('degrees', function(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('Degrees changed to:', newVal);

                var where = {};
                if($scope.topics.length > 0) {
                    where['topics'] = {'$in': $scope.topics}
                }
                if($scope.degrees.length > 0) {
                    where['degree.id'] = {'$in': $scope.degrees}
                }

                // Filter topics based on topics and degrees
                Count.query({
                    'group': 'topics',
                    'limit': 12,
                    'where': where
                }, function(data) {
                    $scope.topic_counts = data;
                    console.log('Updated topic counts after degrees update');
                });
            }
        });

        $scope.$watchCollection('topics', function(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('Topics changed to: ', newVal);

                var where = {};
                if($scope.topics.length > 0) {
                    where['topics'] = {'$in': $scope.topics}
                }
                if($scope.degrees.length > 0) {
                    where['degree.id'] = {'$in': $scope.degrees}
                }

                // Filter degrees only on topics
                DegreeCount.query({
                    'where': {'topics': where['topics']}
                }, function(data) {
                    $scope.degree_counts = data;
                    console.log('Updated degree counts after topics update');
                });
                // Remove filter on degree when clicking on topic
                //$scope.degrees = [];

                // Filter topics based on topics and degrees
                Count.query({
                    'group': 'topics',
                    'limit': 12,
                    'where': where
                }, function(data) {
                    $scope.topic_counts = data;
                    console.log('Updated topic counts after topics update');
                    //$scope.$apply();
                });
            };
        });

        // Start dashboard
        $scope.init();
}]);