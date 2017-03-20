angular.module('app').directive('bubbleChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            selected: '=selected'
        },
        link: function(scope, element, attributes) {

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>University:</strong> <span style='color:orange'>" + d.degrees[0].university.name + "</span>" + "<\hr>" +
                        "<strong>Degree:</strong> <span style='color:orange'>" + d.degrees[0].name + "</span>" + "<\hr>" +
                        "<strong>Number of theses:</strong> <span style='color:orange'>" + d.count + "</span>";
                });

            function toggleSelectedCircle(self) {
                d3.select(".selected-circle")
                    .classed("selected-circle", false);
                d3.select(self).transition()
                    .attr("class", "selected-circle");
            }

            function handleMouseover(d) {
                tip.show(d);
            }

            function handleMouseout(d) {
                tip.hide(d);
            }

            function handleClick(d) {
                console.log("Clicked on circle");
                toggleSelectedCircle(this);
                scope.$apply(function() {
                    scope.selected = d;
                });
            }

            scope.render = function(data) {

                d3.selectAll('.bubble-chart-container').remove();  // Clean before drawing

                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                    height = 800;

                var rMin = d3.min(data, function(d) {return d['count']});
                var rMax = d3.max(data, function(d) {return d['count']})

                // Rendering circles with same size while zooming
                // https://bl.ocks.org/mbostock/2a39a768b1d4bc00a09650edef75ad39
                var zoom = d3.zoom()
                    .scaleExtent([1, 50])
                    .on('zoom', handleZoom);

                var rScale = d3.scaleSqrt()
                    .domain([rMin, rMax])
                    .range([2, 20]);

                var svg = d3.select(element[0])
                    .append('svg')
                    .classed('bubble-chart-container', true)
                    .style('width', '100%')
                    .attr("height", height)
                    .append("g")
                    .call(zoom);

                // Dynamically get svg width
                var width = element[0].getBoundingClientRect().width;

                svg.call(tip);


                var x = d3.scaleLinear()
                    .domain([0, 1])
                    .range([margin.left,  width - margin.right])
                    .nice();

                var y = d3.scaleLinear()
                    .domain([0, 1])
                    .range([margin.top, height - margin.bottom])
                    .nice();


                // Needed to allow zooming and panning in all area,
                // otherwsise only possible on circles
                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var objects = svg.append("svg")
                    .attr("width", width)
                    .attr("height", height);

                objects.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", function(d) {
                        return rScale(d['count']);
                    })
                    .attr("transform", function(d) {
                        return "translate(" + x(d.degrees[0].x) + "," + y(d.degrees[0].y) + ")";
                    })
                    .style("fill", "orange")
                    .attr("opacity", 0.5)
                    .on("mouseover", handleMouseover)
                    .on("mouseout", handleMouseout)
                    .on("click", handleClick);
                // Check http://www.ng-newsletter.com/posts/d3-on-angular.html


                function handleZoom() {
                    console.log("zooming");
                    var transform = d3.event.transform;
                    svg.selectAll("circle").attr("transform", function(d) {
                        return "translate(" + transform.applyX(x(d.degrees[0].x)) + "," + transform.applyY(y(d.degrees[0].y)) + ")";
                    });
                }

            };

            scope.$watch('data', function(newVal, oldVal) {
                console.log("watch fired in bubble chart");
                if (newVal != oldVal) {
                    scope.render(newVal);
                }
            }, true);
        }
    }
});