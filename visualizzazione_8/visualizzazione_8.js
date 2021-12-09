
    am5.ready(function() {
    
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_8");
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
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
    
    // The data
    var data = [
    {
      "year": "2010",
      "Cyprus": 637,
      "Turkey": 120194,
      "Bulgaria": 10448,
      "Hungary": 16328,
      "Poland":80728,
      "Romania": 28244,
      "Slovakia": 8567,
      "Denmark": 3944,
      "Estonia":3393,
      "Finland": 3364,
      "Iceland": 154,
      "Ireland":13758,
      "Latvia": 4701,
      "Lithuania": 8981,
      "Sweden": 5358,
      "United Kingdom (England and Wales)": 93323,
      "Albania": 4605,
      "Bosnia and Herzegovina": 2221,
      "Croatia": 3894,
      "Greece": 10480,
      "Italy": 67961,
      "Kosovo under UNSCR 1244": 1333,
      "Montenegro": 1457,
      "Portugal": 11613,
      "Serbia": 11211,
      "Spain": 73929,
      "Austria": 8569,
      "Belgium": 10535,
      "France" : 66975,
      "Germany": 69385,
      "Netherlands": 13293,
      "Switzerland": 5665
    },
    
    {
      "year": "2011",
      "Cyprus": 634,
      "Turkey": 128253,
      "Bulgaria": 9855,
      "Hungary": 17210,
      "Poland": 81382,
      "Romania": 30694,
      "Slovakia": 9118,
      "Denmark": 3947,
      "Estonia":3400,
      "Finland": 3268,
      "Iceland": 143,
      "Ireland":13952,
      "Latvia": 4488,
      "Lithuania": 9790,
      "Sweden": 5148,
      "United Kingdom (England and Wales)": 94258,
      "Albania": 4607,
      "Bosnia and Herzegovina": 2231,
      "Croatia": 4089,
      "Greece": 10752,
      "Italy": 66897,
      "Kosovo under UNSCR 1244": 1441,
      "Montenegro": 1328,
      "Portugal": 12681,
      "Serbia": 11070,
      "Spain": 70472,
      "Austria": 8793,
      "Belgium": 10973,
      "France" : 73780,
      "Germany": 68099,
      "Netherlands": 12737,
      "Switzerland": 5511
    },
    
    {
      "year": "2012",
      "Cyprus": 694,
      "Turkey": 136638,
      "Bulgaria": 9493,
      "Hungary": 17179,
      "Poland": 84156,
      "Romania": 31817,
      "Slovakia": 9542,
      "Denmark": 3829,
      "Estonia":3286,
      "Finland": 3306,
      "Iceland": 141,
      "Ireland":13860,
      "Latvia": 4171,
      "Lithuania": 9617,
      "Sweden": 4852,
      "United Kingdom (England and Wales)": 94625,
      "Albania": 4890,
      "Croatia": 3890,
      "Greece": 11187,
      "Italy": 65701,
      "Kosovo under UNSCR 1244": 1737,
      "Montenegro": 1064,
      "Portugal": 13614,
      "Serbia": 10226,
      "Spain": 68597,
      "Austria": 8738,
      "Belgium": 11330,
      "France" : 76798,
      "Germany": 65902,
      "Netherlands": 12112,
      "Switzerland": 6001
    },
    
    {
      "year": "2013",
      "Cyprus": 592,
      "Turkey": 144098,
      "Bulgaria": 8834,
      "Hungary": 17841,
      "Poland": 78994,
      "Romania": 33434,
      "Slovakia": 8537,
      "Denmark": 4091,
      "Estonia":3123,
      "Finland": 3295,
      "Iceland": 147,
      "Ireland":13055,
      "Latvia": 3603,
      "Lithuania": 9172,
      "Sweden": 4377,
      "United Kingdom (England and Wales)": 91574,
      "Albania": 5385,
      "Bosnia and Herzegovina": 2521,
      "Croatia": 3326,
      "Greece": 11571,
      "Italy": 62536,
      "Kosovo under UNSCR 1244": 1776,
      "Montenegro": 1064,
      "Portugal": 14284,
      "Serbia": 10031,
      "Spain": 66765,
      "Austria": 8878,
      "Belgium": 11644,
      "France" : 77883,
      "Germany": 62632,
      "Netherlands": 11167,
      "Switzerland": 6537
    },
    
    {
      "year": "2014",
      "Cyprus": 537,
      "Turkey": 158690,
      "Bulgaria": 7870,
      "Hungary": 17890,
      "Poland": 77371,
      "Romania": 30156,
      "Slovakia": 8701,
      "Denmark": 3583,
      "Estonia":3034,
      "Finland": 3148,
      "Iceland": 142,
      "Ireland":13408,
      "Latvia": 3253,
      "Lithuania": 8552,
      "Sweden": 4319,
      "United Kingdom (England and Wales)": 93118,
      "Albania": 5535,
      "Bosnia and Herzegovina": 2537,
      "Croatia": 2881,
      "Greece": 11798,
      "Italy": 53623,
      "Kosovo under UNSCR 1244": 1854,
      "Montenegro": 1123,
      "Portugal": 14003,
      "Serbia": 10288,
      "Spain": 65017,
      "Austria": 8809,
      "Belgium": 11578,
      "France" : 77291,
      "Germany": 61872,
      "Netherlands": 10361,
      "Switzerland": 6414
    },
    
    {
      "year": "2015",
      "Cyprus": 596,
      "Turkey": 177262,
      "Bulgaria": 7408,
      "Hungary": 17449,
      "Poland": 70836,
      "Romania": 28334,
      "Slovakia": 8567,
      "Denmark": 3203,
      "Estonia":2823,
      "Finland": 3135,
      "Iceland": 139,
      "Latvia": 3000,
      "Lithuania": 7270,
      "Sweden": 4292,
      "United Kingdom (England and Wales)": 93635,
      "Albania": 5882,
      "Bosnia and Herzegovina": 2298,
      "Croatia": 2426,
      "Greece": 9611,
      "Italy": 52164,
      "Kosovo under UNSCR 1244": 1478,
      "Montenegro": 1131,
      "Portugal": 14222,
      "Serbia": 10064,
      "Spain": 61614,
      "Austria": 9036,
      "Belgium": 11040,
      "France" : 66678,
      "Germany": 61737,
      "Netherlands": 9143,
      "Switzerland": 6398
    },
    
    {
      "year": "2016",
      "Cyprus": 668,
      "Turkey": 200727,
      "Bulgaria": 7345,
      "Hungary": 17658,
      "Poland": 71528,
      "Romania": 27455,
      "Slovakia": 8557,
      "Denmark": 3408,
      "Estonia":2864,
      "Finland": 3156,
      "Iceland": 116,
      "Latvia": 2966,
      "Lithuania": 6757,
      "Sweden": 4231,
      "United Kingdom (England and Wales)": 92590,
      "Albania": 6031,
      "Bosnia and Herzegovina": 2361,
      "Croatia": 2293,
      "Greece": 9560,
      "Italy": 54653,
      "Kosovo under UNSCR 1244": 1648,
      "Montenegro": 1123,
      "Portugal": 13779,
      "Serbia": 10672,
      "Spain": 59589,
      "Austria": 8619,
      "Belgium": 10619,
      "France" : 68432,
      "Germany": 62865,
      "Netherlands": 9123,
      "Switzerland": 6447
    },
    
    {
      "year": "2017",
      "Cyprus": 625,
      "Turkey": 232340,
      "Bulgaria": 6988,
      "Hungary": 17343,
      "Poland": 73822,
      "Romania": 23450,
      "Slovakia": 8512,
      "Denmark": 3418,
      "Estonia":2723,
      "Finland": 3082,
      "Iceland": 150,
      "Latvia": 2714,
      "Lithuania": 6548,
      "Sweden": 4148,
      "United Kingdom (England and Wales)": 93288,
      "Albania": 5674,
      "Bosnia and Herzegovina": 2361,
      "Croatia": 2234,
      "Greece": 10011,
      "Italy": 57608,
      "Kosovo under UNSCR 1244": 1609,
      "Montenegro": 1119,
      "Portugal": 13440,
      "Serbia": 10807,
      "Spain": 58814,
      "Austria": 8852,
      "Belgium": 10471,
      "France" : 68974,
      "Germany": 64351,
      "Netherlands": 9549,
      "Luxembourg": 684,
      "Switzerland": 6449
    },
    
    {
      "year": "2018",
      "Cyprus": 648,
      "Turkey": 264842,
      "Bulgaria": 6651,
      "Hungary": 16303,
      "Poland": 72204,
      "Romania": 20792,
      "Slovakia": 8715,
      "Denmark": 3635,
      "Estonia":2584,
      "Finland": 2910,
      "Iceland": 147,
      "Latvia": 2541,
      "Lithuania": 6433,
      "Sweden": 4393,
      "United Kingdom (England and Wales)": 91099,
      "Albania": 5316,
      "Bosnia and Herzegovina": 3111,
      "Croatia": 2177,
      "Greece": 10654,
      "Italy": 59655,
      "Kosovo under UNSCR 1244": 1567,
      "Montenegro": 1125,
      "Portugal": 12867,
      "Serbia": 10871,
      "Spain": 58883,
      "Austria": 9099,
      "France" : 70059,
      "Germany": 63643,
      "Netherlands": 9972,
      "Luxembourg": 656,
      "Switzerland": 6507,
      
    }
    ];
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
      location: 0.5,
      multiLocation: 0.9
    });
    
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    
    xAxis.data.setAll(data);
    
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: false
        })
      })
    );
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    
    function createSeries(name, field) {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          hidden: true,
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
    
      series.data.setAll(data);
      series.appear(1000);
    }
    
    
    createSeries("Cyprus", "Cyprus", );
    createSeries("Turkey", "Turkey",);
    createSeries("Bulgaria", "Bulgaria");
    createSeries("Hungary", "Hungary");
    createSeries("Poland", "Poland");
    createSeries("Romania", "Romania");
    createSeries("Slovakia", "Slovakia");
    createSeries("Denmark", "Denmark");
    createSeries("Estonia", "Estonia");
    createSeries("Finland", "Finland");
    createSeries("Iceland", "Iceland");
    createSeries("Latvia", "Latvia");
    createSeries("Lithuania", "Lithuania");
    createSeries("Sweden", "Sweden");
    createSeries("United Kingdom (England and Wales)", "United Kingdom (England and Wales)");
    createSeries("Albania", "Albania");
    createSeries("Bosnia and Herzegovina", "Bosnia and Herzegovina");
    createSeries("Croatia", "Croatia");
    createSeries("Greece", "Greece");
    createSeries("Italy", "Italy");
    createSeries("Kosovo under UNSCR 1244", "Kosovo under UNSCR 1244");
    createSeries("Montenegro", "Montenegro");
    createSeries("Portugal", "Portugal");
    createSeries("Serbia", "Serbia");
    createSeries("Spain", "Spain");
    createSeries("Austria", "Austria");
    createSeries("France", "France");
    createSeries("Germany", "Germany");
    createSeries("Netherlands", "Netherlands");
    createSeries("Luxembourg", "Luxembourg");
    createSeries("Switzerland", "Switzerland");
    
    
    
    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal",
      marginBottom: 20
    }));
    
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        
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
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    
    }); // end am5.ready()