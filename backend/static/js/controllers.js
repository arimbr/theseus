'use strict';

angular.module('theseusApp').controller('countsController', function($scope, CountsAPI) {

    /** TODO: implement state manager **/

    $scope.collections_query_string = {
        group: 'collections',
        limit: 30
    };

    $scope.keywords_query_string = {
        // where: {'collections': 'com_10024_6'},
        group: 'keywords',
        limit: 30
    };

    /** TODO: render all graphs at the same time **/
    $scope.popular_collections = CountsAPI.query($scope.collections_query_string);

    $scope.popular_topics = CountsAPI.query($scope.keywords_query_string);


    $scope.filterResults = function(data, value) {

        console.log("data: " + data);

        if (data === 'popular_collections') {
            $scope.keywords_query_string = {
                where: {'collections': value},
                group: 'keywords',
                limit: 30
            };

            $scope.popular_topics = CountsAPI.query($scope.keywords_query_string)
        } else if (data === 'popular_topics') {
            $scope.collections_query_string = {
                where: {'keywords': value},
                group: 'collections',
                limit: 30
            };

            $scope.popular_collections = CountsAPI.query($scope.collections_query_string)
        }

    };

});