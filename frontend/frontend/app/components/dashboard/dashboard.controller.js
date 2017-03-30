angular.module('app').controller('DashboardCtrl', [
    '$scope',
    '$window',
    '$location',
    'config',
    'Topic',
    'Degree',
    'University',
    'Thesis',
    function($scope, $window, $location, config, Topic, Degree, University, Thesis) {

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
        // TODO: refactor to function
        $scope.includeDesktopTemplate = false;
        $scope.includeMobileTemplate = false;
        var screenWidth = $window.innerWidth;

        if (screenWidth < 960){
            $scope.includeMobileTemplate = true;
        } else {
            $scope.includeDesktopTemplate = true;
        }

        $scope.goHome = function () {
            $location.path('/');
        };

        $scope.init = function() {
            console.log("Reseting dashboard");

            $scope.currentPage = 'page1';

            $scope.languages = [
                {_id: 'fi', label: 'Finnish'},
                {_id: 'en', label: 'English'},
                {_id: 'sv', label: 'Swedish'}
            ];
            $scope.universities = [
                {_id: 'com_10024_6', name: 'Metropolia Ammatikorkeakoulu'},
                {_id: 'com_10024_12', name: 'Laurea Ammatikorkeakoulu'}
            ];

            // Graph filters
            $scope.selected_university = {};
            $scope.selected_language = {};
            $scope.selected_degrees = [];
            $scope.selected_topics = [];

            // Graphs data
            $scope.degrees = [];
            $scope.topics = [];
            $scope.theses = [];

            // TODO: refactor to include initial data load on watch
            // Initial data

            University.query({}, function(data) {
                $scope.universities = data;
            });

            Degree.query({}, function(data) {
                $scope.degrees = data;
            });

            Topic.query({'group': 'topics', 'limit': 12}, function(data) {
                $scope.topics = data;
                //$scope.$apply();
            });

            Thesis.query({'limit': 10, 'fields': "['titles', 'authors', 'urls']"}, function(data) {
                $scope.theses = data;
            });
        };

        $scope.openThesisURL = function(thesis) {
            console.log("Clicked on thesis", thesis);
            $window.open(thesis.urls[0]);
        };

        $scope.getWhereClause = function() {
            var where = {};
            if($scope.selected_topics.length > 0) {
                where['topics'] = {'$in': $scope.selected_topics}
            }
            if($scope.selected_degrees.length > 0) {
                where['degree.id'] = {'$in': $scope.selected_degrees}
            }
            if($scope.selected_language.hasOwnProperty('_id')) {
                where['language'] = $scope.selected_language._id
            }
            if($scope.selected_university.hasOwnProperty('_id')) {
                where['university.id'] = $scope.selected_university._id;
            }
            return where;
        };

        $scope.updateDegrees = function(where) {
            Degree.query({
                // Don't filter degrees based on selected degrees
                'where': {'topics': where['topics'], 'language': where['language'], 'university.id': where['university.id']}
            }, function(data) {
                $scope.degrees = data;
                console.log('Updated degree counts');
            });
        };

        $scope.updateTopics = function(where) {
            Topic.query({
                'group': 'topics',
                'limit': 12,
                'where': where
            }, function(data) {
                $scope.topics = data;
                console.log('Updated topic counts');
                //$scope.$apply();
            });
        };

        $scope.updateTheses = function(where) {
            Thesis.query({
                'limit': 10,
                'fields': "['titles', 'authors', 'urls']",
                'where': where
            }, function(data) {
                $scope.theses = data;
                console.log('Updated theses counts');
            });
        };

        $scope.$watchCollection('selected_degrees', function(newVal, oldVal) {
            if (newVal != oldVal) {
                var where = $scope.getWhereClause();
                $scope.updateTopics(where);
                $scope.updateTheses(where);
            }
        });

        $scope.$watchCollection('selected_topics', function(newVal, oldVal) {
            if (newVal != oldVal) {
                var where = $scope.getWhereClause();
                $scope.updateDegrees(where);
                $scope.updateTopics(where);
                $scope.updateTheses(where);
            }
        });

        $scope.$watchCollection('selected_language', function(newVal, oldVal) {
            if (newVal != oldVal) {
                var where = $scope.getWhereClause();
                $scope.updateDegrees(where);
                $scope.updateTopics(where);
                $scope.updateTheses(where);
            }
        });

        $scope.$watchCollection('selected_university', function(newVal, oldVal) {
            if (newVal != oldVal) {
                var where = $scope.getWhereClause();
                $scope.updateDegrees(where);
                $scope.updateTopics(where);
                $scope.updateTheses(where);
            }
        });

        // Start dashboard
        $scope.init();
}]);