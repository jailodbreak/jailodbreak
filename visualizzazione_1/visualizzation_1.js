var metrics_to_consider_optional = [];
metrics_to_consider_optional.push("total");
metrics_to_consider_optional.push("adults_male");
metrics_to_consider_optional.push("adults_female");
metrics_to_consider_optional.push("juvenile_male");
metrics_to_consider_optional.push("juvenile_female");
metrics_to_consider_optional.push("tot_juvenile");
metrics_to_consider_optional.push("tot_male");
metrics_to_consider_optional.push("tot_female");
metrics_to_consider_optional.push("foreign");
metrics_to_consider_optional.push("nationals");
metrics_to_consider_optional.push("unsentenced");
metrics_to_consider_optional.push("sentenced");
// metrics_to_consider_optional.push("actual");
// metrics_to_consider_optional.push("official");


var jailodbreakMap = L.map('jailodbreakMap').setView([54.5260, 15.2551], 4);
mapLink = 
    '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    clickable: true
}).addTo(jailodbreakMap);
// Add an SVG element to Leaflet’s overlay pane
var svgLabour = d3.select(jailodbreakMap.getPanes().overlayPane).append("svg").attr("pointer-events", "auto"),
    gLabour = svgLabour.append("g").attr("class", "leaflet-zoom-hide");

var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("svg#labour_choropleth"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var selectedYear = 2003;
var selectedTopic = "total";
// var ranges = {"country_name": [], "country_code": [], "year": [], "total": [], "adults_male": [], "adults_female": [], "juvenile_male": [], "juvenile_female": [], "tot_juvenile": [], "tot_male": [], "tot_female": [], "foreign":[], "nationals":[], "unsentenced":[], "sentenced":[]}
var ranges = {"country_name": [], "country_code": [], "year": []}
for (var i = 0; i < metrics_to_consider_optional.length; i++){
    ranges[metrics_to_consider_optional[i]] = [];
}
var years = []
// Map and projection
var path = d3.geoPath(); // Maps GeoJSON features to SVG
var projection = d3.geoEckert6()
  .scale(200)
  .translate([width / 2, height / 2]);

var labour_force = new Map(); // The Map object holds key-value pairs and remembers the original insertion order of the keys.

// Load external data 
var promises = [
    d3.json("./visualizzazione_1/world.geojson"),
    d3.csv("./visualizzazione_1/visualization1.csv", function(d) { 
        var temp = {"year": +d.year}
        for (var i = 0; i < metrics_to_consider_optional.length; i++){
            const metric = metrics_to_consider_optional[i];
            temp[metric] = d[metric];
        }
        if (labour_force.get(d.country_code)) {
            // labour_force.get(d.country_code).push({"year": +d.year, "total": +d.total, "adults_male": +d.adults_male, "adults_female": +d.adults_female, "juvenile_male": +d.juvenile_male, "juvenile_female": +d.juvenile_female, "tot_juvenile": +d.tot_juvenile, "tot_male": +d.tot_male, "tot_female": +d.tot_female, "foreign": +d.foreign, "nationals": +d.nationals, "unsentenced": +d.unsentenced, "sentenced": +d.sentenced})
            labour_force.get(d.country_code).push(temp)
        } else {
            labour_force.set(d.country_code, [temp]); 
        }
        for (value in d) {
            if (ranges[value]){
                ranges[value].push(+d[value])
                if (!(years.includes(+d.year))) {
                    years.push(+d.year)
                }
            }
        }
        years.sort()
    })
]

let mouseOver = function(event, d) {
    d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .3)

    d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", .7)
        .style("stroke", "black")

    tip.transition()
        .duration(200)
        .style("opacity", .9);
    tip.html(function(){
        if (d[selectedYear]) {
            if (d[selectedYear][selectedTopic]) {
                return "<strong>" + d.properties.name + "</strong><br/>"
                + "<strong>" + selectedTopicBeautiful + "</strong>: " + Math.round(d[selectedYear][selectedTopic] * 100) / 100 + "<br/>"
            } else {
                return "<strong>" + d.properties.name + "</strong><br/>" + "No data"
            }
        } else {
            return "<strong>" + d.properties.name + "</strong><br/>" + "No data"
        }
    })
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
}

let mouseLeave = function(d) {
    d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .7)
    d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "black")

    tip.transition()
        .duration(500)
        .style("opacity", 0);
}

// Create selector
// fields = ["total", "adults_male", "adults_female", "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", "unsentenced", "sentenced"]
fields = metrics_to_consider_optional;
var option_select = d3.select('#selectors').append("select")
    .attr("class", "form-control");
for (var i = 0; i < fields.length; i++) {
    option_select.append("option")
    .attr("value", fields[i])
    .text(beautify(fields[i]));
}

function beautify(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1)).replaceAll("_", " ") + " (k)"
}

// Update year, tooltip, legend, viz
function update(year, map){

    selectedTopicBeautiful = beautify(selectedTopic)

    // Legend scale
    var x = d3.scaleLinear()
        .domain(d3.extent(ranges[selectedTopic]))
        .rangeRound([700, 980]);

    colorScale = d3.scaleThreshold()
        .domain([0, d3.max(ranges[selectedTopic])/4, d3.max(ranges[selectedTopic])/2,  d3.max(ranges[selectedTopic])/1.32, d3.max(ranges[selectedTopic])]) 
        .range(d3.schemeOranges[5]);
    // Slider
    slider.property("value", year);
    d3.select(".year").text("Year: " + year);
    d3.selectAll(".Country")
        .style("fill", function(d) {
            if (d[year]) {
                return colorScale(d[year][selectedTopic] || undefined);
            }
        });    
    selectedYear = year;

    // Legend 
    d3.select("g.key").remove()
    var legendLabour = d3.select("#labourMapLegend")
        .append("g")
        .attr("class", "key")
        .style("transform", "translate(-697px, 15px)")

    legendLabour.selectAll("rect")
        .data(colorScale.range().map(function(d) {
            d = colorScale.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return x(d[0]); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("fill", function(d) { return colorScale(d[0]); });

    legendLabour.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "red")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(selectedTopicBeautiful);

    legendLabour.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) { return Math.round(x) })
        .tickValues(colorScale.domain()))
        .select(".domain")
        .remove();
    
    // Tooltip
    map
        .on("mouseover", mouseOver)
}

var slider = d3.select(".slider")
    .append("input")
        .attr("class", "vizSliderInput")
        .attr("type", "range")
        .attr("min", 2003)
        .attr("max", 2018)
        .attr("step", 1)
        .on("input", function() {
            var year = this.value;
            update(year, mapLabourForce);
        });
    
// Use Leaflet to implement a D3 geometric transformation.
function projectPointLabour(x, y) {
    var point = jailodbreakMap.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

Promise.all(promises).then(function(data){
    ready(data);
}).catch(function(error){
    console.log(error);
});

function ready(world) { 
    // Draw the map
    mapLabourForce = svg.append("g")
        .selectAll("path")
        .data(world[0].features)
        // .enter returns an enter selection which basically represents the elements that need to be added. 
        // It’s usually followed by .append which adds elements to the DOM
        .enter()
        .append("path")
        // set the color of each country
        .attr("fill", function (d) {
            if (labour_force.get(d.id)) {
                for (let [i, value] of labour_force.get(d.id).entries()) {
                    var temp = {}
                    for (var j = 0; j < metrics_to_consider_optional.length; j++){
                        const metric = metrics_to_consider_optional[j]
                        temp[metric] = value[metric];
                    }
                    // d[value["year"]] = {"total": value["total"], "adults_male": value["adults_male"], "adults_female": value["adults_female"], "juvenile_male": value["juvenile_male"], "juvenile_female": value["juvenile_female"], "tot_juvenile": value["tot_juvenile"], "tot_male": value["tot_male"], "tot_female": value["tot_female"], "foreign": value["foreign"], "nationals": value["nationals"], "unsentenced": value["unsentenced"], "sentenced": value["sentenced"]}
                    d[value["year"]] = temp;
                }
            }
        })

    //  create a d3.geo.path to convert GeoJSON to SVG
    var transformLeafletLabour = d3.geoTransform({point: projectPointLabour}),
            pathLeafletLabour = d3.geoPath().projection(transformLeafletLabour);
    // create path elements for each of the features
    d3FeaturesLabour = gLabour.selectAll("path")
        .data(world[0].features)
        .enter().append("path")
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave );

    jailodbreakMap.on("zoom", resetLabour);
    resetLabour();
    // fit the SVG element to leaflet's map layer
    function resetLabour() {
        bounds = pathLeafletLabour.bounds(world[0]);
        var topLeft = bounds[0],
            bottomRight = bounds[1];
        svgLabour.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");
        gLabour.attr("transform", "translate(" + -topLeft[0] + "," 
                                        + -topLeft[1] + ")");
        // initialize the path data	
        d3FeaturesLabour.attr("d", pathLeafletLabour)
            .attr("class", function(d){ return "Country" } )
            .style("stroke", "black")
            .style("opacity", .7);
        update(selectedYear, mapLabourForce);
    } 
}

$(document).ready(function(){
    jailodbreakMap.invalidateSize();
    $(document).on("change", option_select, function() {
        selectedTopic = $("#selectors").find(".form-control").val()
        update(selectedYear, mapLabourForce);
    });
    $(document).on("click", ".tablinks:contains('Labour')", function(e) {
        jailodbreakMap.invalidateSize();
    });    
});




