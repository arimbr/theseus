
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
    var rMax = d3.max(data, function(d) {return d['size']})


    // Rendering circles with same size while zooming
    // https://bl.ocks.org/mbostock/2a39a768b1d4bc00a09650edef75ad39
    var zoom = d3.zoom()
        .scaleExtent([1, 30])
        .on('zoom', zoomed);

    var rScale = d3.scaleSqrt()
        .domain([rMin, rMax])
        .range([1, 20]);

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
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    svg.call(tip);

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
            return rScale(d['size']);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d['x']) + "," + y(d['y']) + ")";
        })
        .style("fill", "orange")
        .attr("opacity", 0.5)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    function zoomed() {
        console.log("zooming");
        var transform = d3.event.transform;
        svg.selectAll("circle").attr("transform", function(d) {
            return "translate(" + transform.applyX(x(d['x'])) + "," + transform.applyY(y(d['y'])) + ")";
        });
    }
});