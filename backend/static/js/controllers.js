'use strict';

angular.module('theseusApp').controller('countsController', function($scope, CountsAPI, Settings) {

    /** TODO: implement state manager **/

    $scope.collections_query_string = {
        group: 'organization',
        limit: Settings.LIMIT
    };

    $scope.keywords_query_string = {
        // where: {'collections': 'com_10024_6'},
        group: 'keywords',
        limit: Settings.LIMIT
    };

    /** TODO: render all graphs at the same time **/
    $scope.popular_collections = CountsAPI.query($scope.collections_query_string);

    $scope.popular_topics = CountsAPI.query($scope.keywords_query_string);


    $scope.filterResults = function(data, value) {

        console.log("data: " + data);

        if (data === 'popular_collections') {
            $scope.keywords_query_string = {
                where: {'organization': value},
                group: 'keywords',
                limit: Settings.LIMIT
            };

            $scope.filter = value;
            $scope.popular_topics = CountsAPI.query($scope.keywords_query_string)
        } else if (data === 'popular_topics') {
            $scope.collections_query_string = {
                where: {'keywords': value},
                group: 'organization',
                limit: Settings.LIMIT
            };
            $scope.keywords_query_string = {
                where: {'keywords': value},
                group: 'keywords',
                limit: Settings.LIMIT
            };
            $scope.filter = value;
            $scope.popular_collections = CountsAPI.query($scope.collections_query_string)
            $scope.popular_topics = CountsAPI.query($scope.keywords_query_string)
        }

    };


});