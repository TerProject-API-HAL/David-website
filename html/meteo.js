//url = 'https://api.archives-ouvertes.fr/search/DAVID/?q=*:*&rows=1000&wt=json';
const type = ["Communication dans un congrès", "Article dans une revue", "Thèse", "High Dynamic Range", "LECTURE", "POSTER", "Chapitre d'ouvrage", "Direction d'ouvrage, Proceedings, Dossier", "Autre publication", "TOTAUX"];
const items = ["COMM", "ART", "THESE", "HDR", "LECTURE", "POSTER", "COUV", "DOUV", "OTHER"]; 
var result = [];
var tab;
var totalPub = 0;

function clearInner(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
}

function clear(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    node.parentNode.removeChild(node);
}

function getparannee(annee, equipe, resolve, reject) {
    return new Promise(function (resolve, reject) {
        if(equipe == false){
            var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=*&fq=producedDateY_i:" + annee + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
        }else{
            var url = "https://api.archives-ouvertes.fr/search/DAVID/?q=(" + "\"" + equipe[0].nom +"\"";
            for (var i = 1; i < equipe.length; i++) {
                url += " OR " + "\"" + equipe[i].nom +"\"";
            }
            url += ")&fq=producedDateY_i:" + annee + "&rows=1000&indent=true&facet=true&facet.field=docType_s";
        }
        console.log(url);
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (data) {
                result[annee] = data;
                resolve(data);
            }
        });
    });
}

function compact(){
    var r = [];
    for (var i = 0; i < 6; i++){
        r[i] = result[i + 2015];
    }
    return r;
}

//Cette fonction permet de récupérer les données de l'api et de remplir le tableau 
//En calculant les totaux en fonction du type et de l'année.
function fill() {
    var totauxCOMM = 0;
    var totauxART = 0;
    var totauxTHESE = 0;
    var totauxHDR = 0;
    var totauxLECTURE = 0;
    var totauxPOSTER = 0;
    var totauxCOUV = 0;
    var totauxDOUV = 0;
    var totauxOTHER = 0;
    var totauxPublications = 0;
    for (j = 0; j < result.length; j++) {
        res = result[j].facet_counts.facet_fields.docType_s;
        console.log(res);
        var totauxParAnnee = 0;
        $.each(res, function (key, item) {
            if (item == "COMM") {
                tab[0][j] += res[key + 1];
                totauxCOMM += tab[0][j];
                totauxParAnnee += tab[0][j];
                tab[0][6] = totauxCOMM;
            }
            if (item == "ART") {
                tab[1][j] += res[key + 1];
                totauxART += tab[1][j];
                totauxParAnnee += tab[1][j];
                tab[1][6] = totauxART;
            }
            if (item == "THESE") {
                tab[2][j] += res[key + 1];
                totauxTHESE += tab[2][j];
                totauxParAnnee += tab[2][j];
                tab[2][6] = totauxTHESE;
            }
            if (item == "HDR") {
                tab[3][j] += res[key + 1];
                totauxHDR += tab[3][j];
                totauxParAnnee += tab[3][j];
                tab[3][6] = totauxHDR;
            }
            if (item == "LECTURE") {
                tab[4][j] += res[key + 1];
                totauxLECTURE += tab[4][j];
                totauxParAnnee += tab[4][j];
                tab[4][6] = totauxLECTURE;
            }
            if (item == "POSTER") {
                tab[5][j] += res[key + 1];
                totauxPOSTER += tab[5][j];
                totauxParAnnee += tab[5][j];
                tab[5][6] = totauxPOSTER;
            }
            if (item == "COUV") {
                tab[6][j] += res[key + 1];
                totauxCOUV += tab[6][j];
                totauxParAnnee += tab[6][j];
                tab[6][6] = totauxCOUV;
            }
            if (item == "DOUV") {
                tab[7][j] += res[key + 1];
                totauxDOUV += tab[7][j];
                totauxParAnnee += tab[7][j];
                tab[7][6] += tab[7][j];
            }
            if (item == "OTHER") {
                tab[8][j] += res[key + 1];
                totauxOTHER += tab[8][j];
                console.log(totauxOTHER);
                totauxParAnnee += tab[8][j];
                tab[8][6] += tab[8][j];
            }
            tab[9][j] = totauxParAnnee;
            

        });
         
        tab[9][6] += tab[9][j];


    }
    totalPub = tab[9][6];
        
        console.log("totalPub",totalPub);
        return totalPub;
}

function fillTab() {
    var i = 0;
    $('#dataTable').DataTable().clear().draw();
    $.each(tab, function (key, item) {
        $('#dataTable').dataTable().fnAddData(
            [
                type[i],
                item[0],
                item[1],
                item[2],
                item[3],
                item[4],
                item[5],
                item[6]
            ]
        );
        i++;
    });
    $('#dataTable').dataTable();
}

//Cette fonction permet de transformer les données du tableau en lien
// En cliquant sur une donnée on récupére les paramétres en les passent à la page
//publication.html pour l'affichage des publications concernées
//Ceci est effectué en utlisant l'option CreatedCell des datatables. 
function getCellsData(){
    Annee = [0,2015, 2016, 2017, 2018, 2019, 2020];
    $('#dataTable').DataTable({
        destroy : true,
        'createdRow': function( row, data, dataIndex ) {
              $(row).attr('id', dataIndex);
        },
        "columnDefs": [ {
        "targets":  "_all",
        "createdCell": function (td, cellData, rowData, row, col) { 
            if ( cellData > 0 ) {
            $(td).attr('id', col);
            if (td.id < 7 && row < 9) {
                urlLink = 'publication.html?docType_s=' + items[row] + '&annee=' + Annee[td.id];            
            }else if (td.id >= 7 && row < 9) {
                urlLink = 'publication.html?docType_s=' + items[row];
            }
            else if (td.id < 7 && row >= 9) {
                urlLink = 'publication.html?annee=' + Annee[td.id];
            }
            else
                urlLink = 'publication.html?';
            $(td).html("<a href="+urlLink+">"+cellData+"</a>");
            $(td).css('color', 'blue')
            }
        }
      } ]
    });
}

//Représentation des données sous forme de graphes statistiques en utilisant
//la bibliothèque JavaScript Chart.js
function fillLineChart(data) {
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2015","2016", "2017", "2018", "2019", "2020"],
            datasets: [
                {
                    label: type[0],
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    data: data[0],
                },
                {
                    label: type[1],
                    backgroundColor: "rgba(0, 125, 44, 0.05)",
                    borderColor: "rgba(0, 125, 44, 1)",
                    data: data[1],
                },
                {
                    label: type[2],
                    backgroundColor: "rgba(74, 125, 44, 0.05)",
                    borderColor: "rgba(74, 125, 44, 1)",
                    data: data[2],
                },
                {
                    label: type[3],
                    backgroundColor: "rgba(74, 47, 0, 0.05)",
                    borderColor: "rgba(74, 47, 0, 1)",
                    data: data[3],
                },
                {
                    label: type[4],
                    backgroundColor: "rgba(74, 0, 0, 0.05)",
                    borderColor: "rgba(74, 0, 0, 1)",
                    data: data[4],
                },
                {
                    label: type[5],
                    backgroundColor: "rgba(255, 141, 170, 0.05)",
                    borderColor: "rgba(255, 141, 170, 1)",
                    data: data[5],
                },
                {
                    label: type[6],
                    backgroundColor: "rgba(121, 18, 255, 0.05)",
                    borderColor: "rgba(121, 18, 255, 1)",
                    data: data[6],
                },
                {
                    label: type[7],
                    backgroundColor: "rgba(121, 18, 95, 0.05)",
                    borderColor: "rgba(121, 18, 95, 1)",
                    data: data[7],
                },
                {
                    label: type[8],
                    backgroundColor: "rgba(205, 235, 0, 0.05)",
                    borderColor: "rgba(205, 235, 0, 1)",
                    data: data[8],
                }
            ],
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
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
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
                display: true
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + tooltipItem.yLabel;
                    }
                }
            },
            title: {
                display: true,
                text: "Nombre de Publication par Type et par Année",
            }
        }
    });
}

function fillPublication() {
    clearInner(document.getElementById("result"));
    for (var i = 2015; i <= 2020; i++){
        content = "<h3>" + i + "</h3><hr>";
        $("#result").append(content);
        $.each(result[i].response.docs, function (key, value) {
            content = "<div class='row' style='margin-top: 20px'>" +
                "           <div class='col-md-2'> [ " + value.docid + " ] </div>" +
                "           <div class='col-md-10'>" + value.label_s + "<br>" +
                "               <a href='" + value.uri_s + "' target='_blank'>" + value.uri_s + "</a>" +
                "           </div>" +
                "     </div>"
            $("#result").append(content);
        });
    }
}

function getDavid(){
    tab = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    result = [];
    Promise.all([
        getparannee(2015, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        }),
        getparannee(2016, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        }),
        getparannee(2017, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        }),
        getparannee(2018, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        }),
        getparannee(2019, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        }),
        getparannee(2020, false, function (data) {
            console.log(data);
        }, function (e) {
            console.error(e)
        })
    ]).then(function () {
        result = compact();
        fill();
        fillTab(tab);
        fillLineChart(tab);
        getCellsData();
    })
}