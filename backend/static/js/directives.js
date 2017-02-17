
angular.module('theseusApp').directive('barChart', [function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attribute) {

            var svg = d3.select(element[0])
                .append('div')  // if creating svg element then need to set dimensions to show
                .classed('chart', true);

            console.log("directive created");

            // Render the graph based on data
            scope.render = function(data) {
                    console.log("render called");

                    var x = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) {return +d.count})])  // input
                        .range([20, 100]);  // output

                    // Handle transition
                    //svg.selectAll("div").remove();  // Clean before drawing

                    var chart = svg
                        .selectAll("div")
                        .data(data);

                    chart
                        .enter().append("div")
                        .style("width", function (d) {
                            return x(d.count) + "%";
                        })
                        .style("background", "steelblue")
                        .on("click", function (d, i) {
                            console.log("Clicked " + d._id);
                            d3.select(this).style("background", "orange");
                            scope.$parent.filterResults(attribute.data, d._id);

                        })
                        .on("mouseover", function (d) {
                            d3.select(this).style("background", "orange");

                        })
                        .on("mouseout", function (d) {
                            d3.select(this).style("background", "steelblue");

                        })
                        .html(function (d) {
                            return "<span>" + d._id + "</span><span class='pull-right'>" + d.count + "</span>";
                        });

                    chart
                        .select("div")
                        .style("fill", function(d) {console.log(d); return "red"});
                    // remove old bars
                    chart.exit().remove()
            };

            console.log(scope.data);

            // watchCollection watches for changes inside data (the array of objects)
            scope.$watchCollection('data', function() {
                console.log('watch fired');
                scope.render(scope.data)
                //console.log(scope.data);
            });

        }
    }
}]);