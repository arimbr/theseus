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
            console.log("Initiating dashboard");

            $scope.currentPage = 'page1';
            $scope.updateLanguages({});
            $scope.updateUniversities({});

            // Graph filters
            $scope.selected = $scope.searchToFilter($location.search());
        };

        $scope.reset = function() {
            console.log("Reseting dashboard");

            // Graph filters
            $scope.selected = $scope.searchToFilter({});
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

        $scope.updateLanguages = function(where) {
            $scope.languages = [
                {_id: 'fi', label: 'Finnish'},
                {_id: 'en', label: 'English'},
                {_id: 'sv', label: 'Swedish'}
            ];
            console.log('Updated languages data');
        };

        $scope.updateUniversities = function(where) {
            University.query({}, function(data) {
                $scope.universities = data;
                console.log('Updated universities data');
            });
        };

        $scope.updateDegrees = function(where) {
            Degree.query({
                // Don't filter degrees based on selected degrees
                'where': {'topics': where['topics'], 'language': where['language'], 'university._id': where['university._id']}
            }, function(data) {
                $scope.degrees = data;
                console.log('Updated degrees data');
            });
        };

        $scope.updateTopics = function(where) {
            Topic.query({
                'group': 'topics',
                'limit': 12,
                'where': where
            }, function(data) {
                $scope.topics = data;
                console.log('Updated topics data');
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
                console.log('Updated theses data');
            });
        };

        $scope.updateCounts = function(where) {
            Count.get({
                'where': where
            }, function(data) {
                $scope.counts = data;
                console.log('Updated counts data');
            });
        };

        $scope.filterToSearch = function(filter) {
            var qs = {};

            if(filter.hasOwnProperty('university') && !angular.equals(filter.university, {})) {
                qs.university = filter.university._id;
            }
            if(filter.hasOwnProperty('language') && !angular.equals(filter.language, {})) {
                qs.language = filter.language._id;
            }
            if(filter.hasOwnProperty('degrees') && filter.degrees.length > 0) {
                qs.degree = filter.degrees.map(function(d) {return d});
            }
            if(filter.hasOwnProperty('topics') && filter.topics.length > 0) {
                qs.topic = filter.topics.map(function(d) {return d});
            }
            return qs;
        };

        $scope.searchToFilter = function(search) {
            var filter = {
                university: {},
                language: {},
                degrees: [],
                topics: [],
            };

            if(search.hasOwnProperty('university')) {
                filter.university._id = search.university;
            }
            if(search.hasOwnProperty('language')) {
                filter.language._id = search.language;
            }
            if(search.hasOwnProperty('degree') && search.degree.length > 0) {
                filter.degrees = search.degree.constructor === Array ? search.degree : [search.degree];
            }
            if(search.hasOwnProperty('topic') && search.topic.length > 0) {
                filter.topics = search.topic.constructor === Array ? search.topic : [search.topic];
            }
            return filter;
        };

        $scope.$watch('selected', function(newVal, oldVal) {
            var where = $scope.getWhereClause();
            $scope.updateDegrees(where);
            $scope.updateTopics(where);
            $scope.updateTheses(where);
            $scope.updateCounts(where);
            $location.search($scope.filterToSearch($scope.selected));
        }, true);

        //$scope.$on('$routeUpdate', function(event, newUrl, oldUrl) {
        //
        //    // Start dashboard
        //    console.log("back - forward");
        //    $scope.init();
        //});

        // Start dashboard
        $scope.init();
}]);