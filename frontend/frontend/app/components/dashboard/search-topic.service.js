angular.module('app').factory('SearchTopic', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'search_topics');
    }
]);