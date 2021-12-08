
    let data_dict_vis_3 = false;
    const my_series_vis_3 = [];
    let my_yAxis_vis_3 = undefined;
    const update_data_vis_3 = (d, s, ya) => {
        s.data.setAll(d);
        ya.data.setAll(d);
        s.appear();
    }
    am5.ready(function() {

       
        var root = am5.Root.new("chartdiv_vis_3");


     
        var myTheme = am5.Theme.new(root);

        myTheme.rule("ColorSet").set("colors", [
            am5.color("#e25c02"),
            am5.color("#000000"),
        ]);

        root.setThemes([
            am5themes_Animated.new(root),
            myTheme
        ]);


        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));


        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }))


        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "country_name",
            renderer: am5xy.AxisRendererY.new(root, {
                inversed: true,
                cellStartLocation: 0.1,
                cellEndLocation: 0.9
            })
        }));

        my_yAxis_vis_3 = yAxis;

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            min: 0
        }));


       
        function createSeries(field, name, year=2008) {
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: field,
                categoryYField: "country_name",
                sequencedInterpolation: true,
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
                })
            }));
            my_series_vis_3.push(series);

            series.columns.template.setAll({
                height: am5.p1
            });


            series.bullets.push(function() {
                return am5.Bullet.new(root, {
                    locationX: 1,
                    locationY: 0.5,
                    sprite: am5.Label.new(root, {
                        centerY: am5.p50,
                        text: "{valueX} - {name}",
                        populateText: true
                    })
                });
            });

            

            !data_dict_vis_3 && am5.net.load("./visualizzazione_3/visualization3.json").then(function(result) {
                data_dict_vis_3 = {};
                const data_read = am5.JSONParser.parse(result.response);
                const data = [];
                for (var i = 0; i < data_read.length; i++){
                    const row = data_read[i];
                    if (!data_dict_vis_3[row.year]) data_dict_vis_3[row.year] = [];
                    row.actual && row.official && data_dict_vis_3[row.year].push({
                        actual: (row.actual) ? row.actual : 0,
                        official: (row.official) ? row.official : 0,
                        country_name: row.country_name
                    });
                }
                update_data_vis_3(data_dict_vis_3[year], series, yAxis);
            }).catch(function(result) {
               
                console.log("Error loading " + result);
            });

            series.appear();

            return series;
        }

        createSeries("actual", "actual");
        createSeries("official", "official");


        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }));

        legend.data.setAll(chart.series.values);

        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomY"
        }));
        cursor.lineY.set("forceHidden", true);
        cursor.lineX.set("forceHidden", true);


        chart.appear(1000, 100);

    }); // end am5.ready()

    function changeByYear_vis_3(el){
        console.log(el.value);
        document.getElementById("year_vis_3").innerHTML = el.value
        if (!data_dict_vis_3) return;
        for (var i = 0; i < my_series_vis_3.length; i++){
            update_data_vis_3(data_dict_vis_3[el.value], my_series_vis_3[i], my_yAxis_vis_3);
        }
    }

