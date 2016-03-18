'use strict';

angular.module('theseusApp', ['ngResource'])
    .factory('CountsAPI', function($resource) {
        return {
            query: function(querystring) {
                return $resource('/counts', querystring).query();
            }
        }
    });