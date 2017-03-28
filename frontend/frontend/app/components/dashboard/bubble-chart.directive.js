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
                    return "<div class='bubble-tooltip'>" +
                        "<span><h3>" + d.degrees[0].name + "</h3></span>" +
                        "<span>" + d.degrees[0].university.name + "</span>" + "<br><br>" +
                        "<span>" + d.count + " theses" +"</span>" + "<br>" +
                        "</div>"
                });

            function checkSelected(d) {
                if(scope.selected.indexOf(d._id) > -1) {
                    return true;
                } else {
                    return false;
                }
            }

            function handleMouseover(d) {
                d3.select(this).style("stroke", "rgb(63,81,181)");
                tip.show(d);
            }

            function handleMouseout(d) {
                d3.select(this).style("stroke", "orange");
                tip.hide(d);
            }

            function handleClick(d) {
                console.log("Selected circle", d);
                var index = scope.selected.indexOf(d._id)
                if( index > -1) {
                    // Remove element
                    d3.select(this)
                        .classed("selected-circle", false);
                    scope.$apply(function() {
                        scope.selected.splice(index, 1);
                    });
                } else {
                    // Add new element
                    d3.select(this).transition()
                        .attr("class", "selected-circle");
                    scope.$apply(function() {
                        scope.selected.push(d._id);
                    });
                }

            }

            scope.render = function(data) {

                console.log("Rendering bubble chart");

                d3.selectAll('.bubble-chart-container').remove();  // Clean before drawing

                var margin = {top: 20, right: 20, bottom: 20, left: 20},
                    height = 650;

                var rMin = d3.min(data, function(d) {return d['count']});
                var rMax = d3.max(data, function(d) {return d['count']});

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

                svg.call(tip);

                // Dynamically get svg width
                var width = element[0].getBoundingClientRect().width;


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
                    .classed("selected-circle", checkSelected)
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

            scope.$watchCollection('data', function(newVal, oldVal) {
                console.log("Watch fired in bubble chart");
                if (newVal != oldVal) {
                    scope.render(newVal);
                }
            });
        }
    }
});