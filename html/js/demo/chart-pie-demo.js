// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
const annee = ["2015","2016", "2017", "2018", "2019", "2020"];
const colors = ["rgba(78, 115, 223, 1)", "rgba(0, 125, 44, 1)", "rgba(74, 125, 44, 1)",
    "rgba(74, 47, 0, 1)", "rgba(74, 0, 0, 1)", "rgba(255, 141, 170, 1)", "rgba(121, 18, 255, 1)",
    "rgba(121, 18, 95, 1)", "rgba(205, 235, 0, 1)"]

var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:[2016 TO 2020]&rows=0&indent=true&facet=true&facet.field=docType_s";

$.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: function (data) {
        var res = data.facet_counts.facet_fields.docType_s;
        var data = [];
        $.each(res, function (key, item) {
            if (item == "COMM") {
                data[0] = res[key + 1];
            }
            if (item == "ART") {
                data[1] = res[key + 1];
            }
            if (item == "THESE") {
                data[2] = res[key + 1];
            }
            if (item == "HDR") {
                data[3] = res[key + 1];
            }
            if (item == "LECTURE") {
                data[4] = res[key + 1];
            }
            if (item == "POSTER") {
                data[5] = res[key + 1];
            }
            if (item == "COUV") {
                data[6] = res[key + 1];
            }
            if (item == "DOUV") {
                data[7] = res[key + 1];
            }
            if (item == "OTHER") {
                data[8] = res[key + 1];
            }
        });
        
    }
});

url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:[2015 TO 2020]&rows=0&indent=true&facet=true&facet.field=producedDateY_i";

$.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: function (data) {
        console.log();
        $("#totalPub").append(data.response.numFound + " publications");
        var res = data.facet_counts.facet_fields.producedDateY_i;
        var data = [];
        var an;
        var nbr = 0;
        $.each(res, function (key, item) {
            if (item == "2015") {
                data[0] = res[key + 1];
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
            if (item == "2016") {
                data[1] = res[key + 1];
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
            if (item == "2017") {
                data[1] = res[key + 1];
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
            if (item == "2018") {
                data[2] = res[key + 1];
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
            if (item == "2019") {
                data[3] = res[key + 1];
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
            if (item == "2020") {
                data[4] = res[key + 1];
                $("#enCours").append(res[key + 1] + " publications");
                if (res[key + 1] > nbr){
                    nbr = res[key + 1];
                    an = item;
                }
            }
        });
        $("#meilleurAnnee").append(an + " (" + nbr +") ");

        var ctx = document.getElementById("myBarChart");
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: annee,
                datasets: [{
                    label: "Publication",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: data,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'month'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 6
                        },
                        maxBarThickness: 25,
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return value;
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {
                        label: function(tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + tooltipItem.yLabel;
                        }
                    }
                },
            }
        });
    }
});