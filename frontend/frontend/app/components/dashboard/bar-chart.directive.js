angular.module('app').directive('barChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            selected: '=selected'
        },
        link: function(scope, element, attributes) {

            function checkSelected(d) {
                if(scope.selected.indexOf(d._id) > -1) {
                    return true;
                } else {
                    return false;
                }
            }

            function handleClick(d) {
                console.log("Selected bar: ", d);
                var index = scope.selected.indexOf(d._id)
                if( index > -1) {
                    // Remove element
                    scope.$apply(function() {
                        scope.selected.splice(index, 1);
                    });
                } else {
                    // Add new element
                    scope.$apply(function() {
                        scope.selected.push(d._id);
                    });
                }
            }

            function toggleSelectedBar(self) {
                d3.select(".selected-bar")
                    .classed("selected-bar", false);
                d3.select(self)
                    .attr("class", "selected-bar");
            }

            // Render the graph based on data
            scope.render = function(data) {

                console.log("Rendering bar chart");

                // Handle transition
                d3.selectAll('.bar-chart-container').remove();  // Clean before drawing

                // Dynamically get svg width
                // Depending on layout, may need to access parent width
                var width = element[0].parentElement.getBoundingClientRect().width;
                var margin = {top: 10, right: 30, bottom: 10, left: 20};
                var maxX = d3.max(data, function(d) {return +d.count});

                var svg = d3.select(element[0])
                    .append('div')
                    .classed('bar-chart-container', true);

                var x = d3.scaleLinear()
                    .domain([0, maxX])  // input
                    .range([margin.left,  width - margin.right]);

                var chart = svg
                    .selectAll("div");

                var divs = chart.data(data)
                    .enter().append("div")
                    .attr("class", "bar-container")
                    .on("click", handleClick)
                    .on("mouseover", function (d) {
                        d3.select(this).select('.bar')
                            .style("border-color", "rgb(237, 167, 0)");

                    })
                    .on("mouseout", function (d) {
                        d3.select(this).select('.bar')
                            .style("border-color", "rgb(250,250,250)");

                    });

                divs.append("span")
                    .attr("class", "bar-text")
                    .text(function(d) {
                        return d._id;
                    });
                divs.append("div")
                    .attr("class", "bar")
                    .style("width", function(d) {
                        return x(d.count) + 'px';
                    })
                    .classed("selected-bar", checkSelected)
                    .append("span")
                    .attr("class", "bar-number")
                    .html(function(d) {
                        return d.count;
                    });
            };


            scope.$watchCollection('data', function(newVal, oldVal) {
                //debugger;
                if (newVal != oldVal) {
                    console.log("Watch fired in bar chart");
                    scope.render(newVal);
                }
            });

        }
    }
});