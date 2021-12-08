let my_series_vis_7 = [];
let data_dict_vis_7 = false;
let my_xAxis_vis_7 = undefined;

const update_data_vis_6 = (d, s, xa) => {
  console.log("dict", d)
  s.data.setAll({});
  xa.data.setAll({});
  s.data.setAll(d);
  xa.data.setAll(d);
  s.appear();
}

const init_selectors_vis_6 = (year_list) => {

    // years
    const year_selector = document.getElementById("year_select");
    const max_year = year_list.reduce(function(a, b) {
        return Math.max(a, b);
    });
    const min_year = year_list.reduce(function(a, b) {
        return Math.min(a, b);
    });

    year_selector.max = `${max_year}`;
    year_selector.min = `${min_year}`;
    year_selector.value = `${min_year}`;

    document.getElementById("year_vis_7").innerHTML = min_year;

    return {
        year: min_year,
    };
}

am5.ready(function() {

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("chartdiv_vis_7");


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
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  }));


  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    })
  );


  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, {
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    minGridDistance: 20
  });
  xRenderer.labels.template.setAll({ fontSize: "8px"});
  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "country_name",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  my_xAxis_vis_7 = xAxis;

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));


  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  function makeSeries(name, fieldName) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: fieldName,
      categoryXField: "country_name",
      // width: am5.percent(100)
    }));

    my_series_vis_7.push(series);

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}:{valueY}",
      tooltipY: 0
    });

    !data_dict_vis_7 && am5.net.load("./visualizzazione_7/visualization7.json").then(function(result) {
        data_dict_vis_7 = {};
        const data_read = am5.JSONParser.parse(result.response);
        const year_list = [];
        for (var i = 0; i < data_read.length; i++){
            const row = data_read[i];
            if (!data_dict_vis_7[row.year]) data_dict_vis_7[row.year] = [];

            row.sentenced && row.unsentenced && data_dict_vis_7[row.year].push({
              sentenced: (row.sentenced) ? row.sentenced : 0,
              unsentenced: (row.unsentenced) ? row.unsentenced : 0,
              country_name: row.country_name
            });
        }
        for (var year_obj_key in data_dict_vis_7) {
          if (data_dict_vis_7[year_obj_key].length == 0) delete data_dict_vis_7[year_obj_key];
          else year_list.push(year_obj_key); // selector
        }
        const defaults = init_selectors_vis_6(year_list);
        update_data_vis_6(data_dict_vis_7[defaults.year], series, xAxis);
    }).catch(function(result) {
        // This gets executed if there was an error loading URL
        // ... handle error
        console.log("Error loading " + result);
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: am5.Label.new(root, {
          text: "{valueY}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true
        })
      });
    });

    legend.data.push(series);
  }

  makeSeries("Sentenced", "sentenced");
  makeSeries("Unsentenced", "unsentenced");

  chart.appear(1000, 100);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/

}); // end am5.ready()

function changeByYear_vis_7(el){
    console.log(el.value);
    document.getElementById("year_vis_7").innerHTML = el.value
    if (!data_dict_vis_7) return;
    for (var i = 0; i < my_series_vis_7.length; i++){
      update_data_vis_6(data_dict_vis_7[el.value], my_series_vis_7[i], my_xAxis_vis_7);
    }
}