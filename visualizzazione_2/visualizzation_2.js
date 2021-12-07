let my_series_vis_2 = undefined;
let data_dict_vis_2 = false;

const update_data_vis_2 = (d, s) => {
    s.data.setAll({});
    s.data.setAll(d);
    s.appear();
}

const init_selectors = (country_list, year_list) => {
    // countries
    const country_selector = document.getElementById('country_select_vis_2');
    for (var i = 0; i<=country_list.length; i++){
        var opt = document.createElement('option');
        opt.value = country_list[i];
        opt.innerHTML = country_list[i];
        i==0 && opt.setAttribute('selected', true);
        country_selector.appendChild(opt);
    }

    // years
    const year_selector = document.getElementById("year_select_vis_2");
    const max_year = year_list.reduce(function(a, b) {
        return Math.max(a, b);
    });
    const min_year = year_list.reduce(function(a, b) {
        return Math.min(a, b);
    });

    year_selector.max = `${max_year}`;
    year_selector.min = `${min_year}`;
    year_selector.value = `${min_year}`;

    document.getElementById("year_vis_2").innerHTML = min_year;

    return {
        country: country_list[0],
        year: min_year,
    };
}

am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_vis_2");


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
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
    }));
    my_series_vis_2 = series;

    !data_dict_vis_2 && am5.net.load("./visualizzazione_2/visualization2.json").then(function(result) {
        data_dict_vis_2 = {};
        const data_read = am5.JSONParser.parse(result.response);
        const data = [];

        const country_list = [];
        const year_list = [];
        for (var i = 0; i < data_read.length; i++){
            const row = data_read[i];

            if (row.adults_male > 0 || row.adults_female > 0 || row.juvenile_male > 0 || row.juvenile_female > 0) {
                // selectors
                if (!country_list.includes(row.country_name.trim())) country_list.push(row.country_name.trim());
                if (!year_list.includes(Number(row.year))) year_list.push(row.year);

                // data dict init
                if (!data_dict_vis_2[row.country_name]) {
                    data_dict_vis_2[row.country_name] = {};
                }
                data_dict_vis_2[row.country_name][row.year] = [];
                row.adults_male > 0 && data_dict_vis_2[row.country_name][row.year].push({value: row.adults_male, category: "Adults male"});
                row.adults_female > 0 && data_dict_vis_2[row.country_name][row.year].push({value: row.adults_female, category: "Adults female"});
                row.juvenile_male > 0 && data_dict_vis_2[row.country_name][row.year].push({value: row.juvenile_male, category: "Juvenile male"});
                row.juvenile_female > 0 && data_dict_vis_2[row.country_name][row.year].push({value: row.juvenile_female, category: "Juvenile female"});
            }
        }
        const defaults = init_selectors(country_list, year_list);
        update_data_vis_2(data_dict_vis_2[defaults.country][defaults.year], series);
    }).catch(function(result) {
        // This gets executed if there was an error loading URL
        // ... handle error
        console.log("Error loading " + result);
    });

    series.appear();


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

}); // end am5.ready()

function changeByYear_vis_2(){
    const year_selected = document.getElementById("year_select_vis_2").value;
    const country_selected = document.getElementById("country_select_vis_2").value;
    document.getElementById("year_vis_2").innerHTML = year_selected;
    if (!data_dict_vis_2) return;
    update_data_vis_2(data_dict_vis_2[country_selected][year_selected], my_series_vis_2);
}