angular.module('app').factory('Degree', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'degrees/:degreeId', {degreeId: '@degreeId'});
    }
]);