angular.module('app').factory('University', [
    '$resource',
    'config',
    function($resource, config) {
        return $resource(config.apiUrl + 'universities');
    }
]);