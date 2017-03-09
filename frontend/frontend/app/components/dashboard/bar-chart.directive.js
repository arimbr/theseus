angular.module('app').directive('barChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            selected: '=selected'
        },
        link: function(scope, element, attributes) {

            // Render the graph based on data
            scope.render = function(data) {

                // Dynamically get svg width
                var width = element[0].getBoundingClientRect().width;
                var margin = {top: 10, right: 10, bottom: 10, left: 10};
                var maxX = d3.max(data, function(d) {return +d.count});

                var svg = d3.select(element[0])
                    .append('div')
                    .classed('chart', true);

                var x = d3.scaleLinear()
                    .domain([0, maxX])  // input
                    .range([margin.left,  width - margin.right])
                    .nice();

                // Handle transition
                //svg.selectAll("div").remove();  // Clean before drawing

                var chart = svg
                    .selectAll("div")
                    .data(data);

                chart
                    .enter().append("div")
                    .style("width", function (d) {
                        return x(d.count) + 'px';
                    })
                    .on("click", function (d, i) {
                        console.log("Clicked " + d._id);
                        //d3.select(this).style("background", "orange");

                    })
                    .on("mouseover", function (d) {
                        d3.select(this).style("background", "orange");

                    })
                    .on("mouseout", function (d) {
                        d3.select(this).style("background", "rgb(63,81,181)");

                    })
                    .html(function (d) {
                        return "<span>" + d._id + "</span>";
                    });

                chart
                    .select("div")
                    .style("fill", function(d) {console.log(d); return "red"});
                // remove old bars
                //chart.exit().remove()
            };


            scope.$watch('data', function(newVal, oldVal) {
                console.log("watch fired");
                if (newVal != oldVal) {
                    scope.render(newVal);
                }
            }, true);

        }
    }
});