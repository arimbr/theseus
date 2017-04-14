angular.module('app').directive('degreeLegend', ['Degree', function(Degree) {
    return {
        restrict: 'E',
        scope: {
            //selected: '=',
            hovered: '='
        },
        template: '<h3>{{hovered.degrees[0].name}}</h3><span>{{hovered.degrees[0].university.name}}</span>',
        //link: function(scope, element, attribute) {
        //    console.log("hi world");
        //
        //    //scope.$watch('selected', function(newVal, oldVal) {
        //    //    var id = newVal[0];
        //    //    Degree.get({degreeId: id}, function(data) {
        //    //        console.log(data);
        //    //        scope.degree = data;
        //    //    })
        //    //});
        //
        //    scope.$watch('hovered', function(newVal, oldVal) {
        //        //debugger;
        //        scope.h = newVal;
        //    }, true);
        //}
    }
}]);