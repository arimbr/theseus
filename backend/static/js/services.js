'use strict';

angular.module('theseusApp', ['ngResource'])
    .factory('CountsAPI', function($resource) {
        return {
            query: function(querystring) {
                return $resource('/counts', querystring).query();
            }
        }
    })
    .factory('dataManager', ['CountsAPI', function() {
        var _entries = {};

        return {
            getData: function(key) {
                var entry = _entries[key];

                CountsAPI.query(
                    {
                        where: entry[where],
                        limit: entry[limit],
                        group: entry[group]
                    }
                ).then(function(data) {
                        _entries[key] = data;
                    }
                )
            },

        };
    }]);

angular.module('theseusApp')
    .factory('Settings', function() {
        return {
            LIMIT: 100,
        }
    });


var data = {
    popular_topics: {
        where: {},
        limit: 10,
        group: 'keyword',
        data: [
            {'_id': 'python', 'count': 4},
            {'_id': 'java', 'count': 3}
        ]
    }
};
