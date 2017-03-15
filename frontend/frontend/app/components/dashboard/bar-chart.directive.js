angular.module('app').directive('barChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            selected: '=selected'
        },
        link: function(scope, element, attributes) {

            function handleClick(d) {
                console.log("Selected");
                scope.$apply(function() {
                    scope.selected = d;
                });
            }

            // Render the graph based on data
            scope.render = function(data) {

                // Handle transition
                d3.selectAll('.bar-chart-container').remove();  // Clean before drawing

                console.log("rendering bar chart");
                console.log(data);

                // Dynamically get svg width
                var width = element[0].getBoundingClientRect().width;
                var margin = {top: 10, right: 10, bottom: 10, left: 10};
                var maxX = d3.max(data, function(d) {return +d.count});

                var svg = d3.select(element[0])
                    .append('div')
                    .classed('bar-chart-container', true);

                var x = d3.scaleLinear()
                    .domain([0, maxX])  // input
                    .range([margin.left,  width - margin.right]);

                var chart = svg
                    .selectAll("div")
                    .data(data);

                chart
                    .enter().append("div")
                    .style("width", function (d) {
                        return x(d.count) + 'px';
                    })
                    .on("click", handleClick)
                    .on("mouseover", function (d) {
                        d3.select(this).style("background", "orange");

                    })
                    .on("mouseout", function (d) {
                        d3.select(this).style("background", "rgb(63,81,181)");

                    })
                    .html(function (d) {
                        return "<span>" + d._id + "</span>"
                            + "<span class='bar-count'>" + d.count + "</span>";
                    });

                chart
                    .select("div")
                    .style("fill", function(d) {console.log(d); return "red"});
                // remove old bars
                //chart.exit().remove()
            };


            scope.$watch('data', function(newVal, oldVal) {
                //debugger;
                if (newVal != oldVal) {
                    console.log("watch fired in bar chart");
                    scope.render(newVal);
                }
            }, true);

        }
    }
});