let lock_vis_6 = false;

am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_vis_6");
    
    // Set themes
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
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none"
      })
    );
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
                
    xRenderer.labels.template.setAll({ text: "{realName}" , fontSize: "8px"});
    // xRenderer.labels.template.setAll({ text: "" });
    
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {
          labelText: "{realName}"
        })
      })
    );
    
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );
    
    var yAxis2 = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        syncWithAxis: yAxis,
        renderer: am5xy.AxisRendererY.new(root, { opposite: true })
      })
    );
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Suicides",
        xAxis: xAxis,
        yAxis: yAxis2,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{provider} - {realName}: {valueY}"
        })
      })
    );
    
    series.columns.template.setAll({
      fillOpacity: 0.9,
      strokeOpacity: 0
    });
    series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(0);
    });
    
    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    var series_2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Tot staff",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "quantity",
        sequencedInterpolation: true,
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{provider} - {realName1}: {valueY}"
        })
      })
    );
    
    series_2.columns.template.setAll({
      fillOpacity: 0.9,
      strokeOpacity: 0
    });
    series_2.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(1);
    });
    
    series_2.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series_2.columns.indexOf(target));
    });
    
    function handleData(data){
      var chartData = [];
      for (var i = 0; i < data.length; i++){
          const single_country = data[i];
          if (single_country.year == 2016){
              chartData.push({
                  category: single_country.country_name,
                  realName: "Suicides",
                  realName1: "Tot staff",
                  provider: single_country.country_name,
                  quantity: single_country.total_staff,
                  value: single_country.suicide_mortality,
              });
              var range = xAxis.makeDataItem({});
              xAxis.createAxisRange(range);
    
              range.set("category", single_country.country_name);
              //   range.set("ASD", tempArray[tempArray.length - 1].category);
    
              var label = range.get("label");
    
              label.setAll({
                  text: single_country.country_name,
                  dy: 30,
                  fontWeight: "normal",
                  fontSize: "10px",
                  tooltipText: single_country.country_name
              });
    
              var tick = range.get("tick");
              tick.setAll({ visible: true, strokeOpacity: 1, length: 50, location: 0 });
    
              var grid = range.get("grid");
              grid.setAll({ strokeOpacity: 1 });
          }
      }
    
      const chartData2 = [];
    
      for (let i = 0; i < chartData.length; i++){
          var obj = JSON.parse(JSON.stringify(chartData[i]));
          // obj.realName = obj.realName+" \n quantity";
          obj.realName = "";
          chartData2.push(obj);
      }
    
      xAxis.data.setAll(chartData2);
      series.data.setAll(chartData);
      series_2.data.setAll(chartData);
    
    }
    
    !lock_vis_6 && am5.net.load("./visualizzazione_6/visualization6.json").then(function(result) {
      const data = am5.JSONParser.parse(result.response);
      lock_vis_6 = true;
      handleData(data)
    
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
      
      series.appear(1000);
      series_2.appear(1000); 
    }).catch(function(result) {
      console.log("Error loading " + result);
    });
    
    
    
    // Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/


}); // end am5.ready()