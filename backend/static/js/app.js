'use strict';

var theseusApp = angular.module('theseusApp', []);

/** Configure angular to use {[ ]} for binding tags because jinja uses {{ }} to insert values onto templates **/
theseusApp.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);


