angular.module('app').factory('DegreeCount', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'degrees/counts');
    }
]);