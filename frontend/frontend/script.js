
var margin = {top: 50, right: 300, bottom: 50, left: 50},
    outerWidth = 1600,
    outerHeight = 800,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([-0.1, 1.1])
    .range([0, width])
    .nice();

var y = d3.scaleLinear()
    .domain([-0.1, 1.1])
    .range([0,height])
    .nice();

d3.json("degrees_universities_tsne.json", function(data) {

    // check http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e

    var rMin = d3.min(data, function(d) {return d['size']});
    var rMax = d3.max(data, function(d) {return d['size']});

    var rScale = d3.scaleSqrt()
        .domain([rMin, rMax])
        .range([3, 20]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>University:</strong> <span style='color:orange'>" + d.university + "</span>" + "<\hr>" +
                   "<strong>Degree:</strong> <span style='color:orange'>" + d.degree + "</span>" + "<\hr>" +
                   "<strong>Number of theses:</strong> <span style='color:orange'>" + d.size + "</span>";
        });

    var svg = d3.select("#scatter")
        .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var objects = svg.append("svg")
        .attr("width", width)
        .attr("height", height);

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("r", function(d) {
            return rScale(d['size']);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d['x']) + "," + y(d['y']) + ")";
        })
        .style("fill", "orange")
        .attr("opacity", 0.5)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

});