angular.module('app').controller('DashboardCtrl', [
    '$scope',
    '$window',
    '$location',
    'config',
    'Topic',
    'Degree',
    'University',
    'Thesis',
    'Count',
    function($scope, $window, $location, config, Topic, Degree, University, Thesis, Count) {

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

            University.query({}, function(data) {
                $scope.universities = data;
            });

            // Graph filters
            $scope.selected = {
                university: {},
                language: {},
                degrees: [],
                topics: [],
            };

            // Graphs data
            //var where = $scope.getWhereClause();
            //$scope.updateDegrees(where);
            //$scope.updateTopics(where);
            //$scope.updateTheses(where);
            //$scope.updateCounts(where);
        };

        $scope.openThesisURL = function(thesis) {
            console.log("Clicked on thesis", thesis);
            $window.open(thesis.urls[0]);
        };

        $scope.getWhereClause = function() {
            var where = {};
            if($scope.selected.topics.length > 0) {
                where['topics'] = {'$in': $scope.selected.topics}
            }
            if($scope.selected.degrees.length > 0) {
                where['degree._id'] = {'$in': $scope.selected.degrees}
            }
            if($scope.selected.language.hasOwnProperty('_id')) {
                where['language'] = $scope.selected.language._id
            }
            if($scope.selected.university.hasOwnProperty('_id')) {
                where['university._id'] = $scope.selected.university._id;
            }
            return where;
        };

        $scope.updateDegrees = function(where) {
            Degree.query({
                // Don't filter degrees based on selected degrees
                'where': {'topics': where['topics'], 'language': where['language'], 'university._id': where['university._id']}
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
                'limit': 9,
                'fields': "['titles', 'authors', 'urls']",
                'where': where
            }, function(data) {
                $scope.theses = data;
                console.log('Updated theses');
            });
        };

        $scope.updateCounts = function(where) {
            Count.get({
                'where': where
            }, function(data) {
                $scope.counts = data;
                console.log('Updated thesis count');
            });
        };

        $scope.$watch('selected', function(newVal, oldVal) {
            var where = $scope.getWhereClause();
            $scope.updateDegrees(where);
            $scope.updateTopics(where);
            $scope.updateTheses(where);
            $scope.updateCounts(where);
        }, true);

        //$scope.$watchCollection('selected_degrees', function(newVal, oldVal) {
        //    if (newVal != oldVal) {
        //        var where = $scope.getWhereClause();
        //        $scope.updateTopics(where);
        //        $scope.updateTheses(where);
        //        $scope.updateCounts(where);
        //    }
        //});
        //
        //$scope.$watchCollection('selected_topics', function(newVal, oldVal) {
        //    if (newVal != oldVal) {
        //        var where = $scope.getWhereClause();
        //        $scope.updateDegrees(where);
        //        $scope.updateTopics(where);
        //        $scope.updateTheses(where);
        //        $scope.updateCounts(where);
        //    }
        //});
        //
        //$scope.$watchCollection('selected_language', function(newVal, oldVal) {
        //    if (newVal != oldVal) {
        //        var where = $scope.getWhereClause();
        //        $scope.updateDegrees(where);
        //        $scope.updateTopics(where);
        //        $scope.updateTheses(where);
        //        $scope.updateCounts(where);
        //    }
        //});
        //
        //$scope.$watchCollection('selected_university', function(newVal, oldVal) {
        //    if (newVal != oldVal) {
        //        var where = $scope.getWhereClause();
        //        $scope.updateDegrees(where);
        //        $scope.updateTopics(where);
        //        $scope.updateTheses(where);
        //        $scope.updateCounts(where);
        //    }
        //});

        // Start dashboard
        $scope.init();
}]);