angular.module('app').factory('Topic', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'topics');
    }
]);