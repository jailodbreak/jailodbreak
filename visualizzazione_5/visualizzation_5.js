let lock_vis_5 = false;

am5.ready(function() {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv_vis_5");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/

var myTheme = am5.Theme.new(root);

myTheme.rule("ColorSet").set("colors", [
    am5.color("#e25c02"),
    am5.color("#000000"),
]);

root.setThemes([
    am5themes_Animated.new(root),
    myTheme
]);



// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
    })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
}));
cursor.lineY.set("visible", false);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
    location: 0.5,
    multiLocation: 0.5
});

var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    })
);

var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
        inversed: false
        })
    })
);


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal",
    marginBottom: 20
}));

var legend = chart.children.push(
am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
})
);

// Make series change state when legend item is hovered
legend.itemContainers.template.states.create("hover", {});

legend.itemContainers.template.events.on("pointerover", function(e) {
    e.target.dataItem.dataContext.hover();
});
legend.itemContainers.template.events.on("pointerout", function(e) {
    e.target.dataItem.dataContext.unhover();
});

legend.data.setAll(chart.series.values);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

function createSeries(name, field) {
    var series = chart.series.push(
        am5xy.LineSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "year",
        tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
        })
        })
    );


    series.bullets.push(function() {
        return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
            radius: 5,
            fill: series.get("fill")
        })
        });
    });

    // create hover state for series and for mainContainer, so that when series is hovered,
    // the state would be passed down to the strokes which are in mainContainer.
    series.set("setStateOnChildren", true);
    series.states.create("hover", {});

    series.mainContainer.set("setStateOnChildren", true);
    series.mainContainer.states.create("hover", {});

    series.strokes.template.states.create("hover", {
        strokeWidth: 4
    });

    !lock_vis_5 && am5.net.load("./visualizzazione_5/visualization5.json").then(function(result) {
        lock_vis_5 = true;
        const data = am5.JSONParser.parse(result.response);
        series.data.setAll(data);
        xAxis.data.setAll(data);
    }).catch(function(result) {
        // This gets executed if there was an error loading URL
        // ... handle error
        console.log("Error loading " + result);
    });

    series.appear(1000);
}


createSeries("European country that make assessment of prison health services", "mortality_yes");
createSeries("European country that do not make assessment of prison health services", "mortality_no");
legend.data.setAll(chart.series.values);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);

}); // end am5.ready()