angular.module('app').factory('Count', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'counts');
    }
]);