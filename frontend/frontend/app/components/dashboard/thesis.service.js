angular.module('app').factory('Thesis', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'theses');
    }
]);