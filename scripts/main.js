var service;
var chart;
var chartDistance = [];
var chartDuration = [];
var chartLabel = [];
var initialized = false;

function initMap() {
    service = new google.maps.DirectionsService;
    $("#work").geocomplete();
    $("#home").geocomplete();
    initialized = true;
}

function generateChart(newDistance, newDuration, newLabel) {
    if (newDistance>=0) {
        chartDistance.push(newDistance);
        chartDuration.push(newDuration);
        chartLabel.push(newLabel);
    }
    var ctx = document.getElementById("myChart");
    chart = new Chart(ctx, {type: 'line', data: {
        labels: chartLabel,
        datasets: [
            {
                type:"line",
                label: "Jarak",
                yAxisID: "y-jarak",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: chartDistance,
                spanGaps: false
            },
            {
                type:"line",
                label: "Durasi",
                yAxisID: "y-durasi",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(192,75,192,0.4)",
                borderColor: "rgba(192,75,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(192,75,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(192,75,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: chartDuration,
                spanGaps: false
            }
        ]
        },options: {
            scales: {
                yAxes: [{
                    scaleLabel:{
                        display:true,
                        labelString:"Jarak (meter)"
                    },
                    position: "left",
                    ticks: {
                        beginAtZero: true
                    },
                    id: "y-jarak"
                }, {
                    scaleLabel:{
                        display:true,
                        labelString:"Durasi (menit)"
                    },
                    position: "right",
                    ticks: {
                        beginAtZero: true
                    },
                    id: "y-durasi"
                }]
            }
        }
    });
}

$(document).ready(function(){
    var reloader = null;

    generateChart();

    function handleChange() {
        if (reloader!=null) {
            clearInterval(reloader);
            reloader = null;
        }
    }

    $("#work").change(handleChange);
    $("#home").change(handleChange);

    $("#submit").click(function(){
        if (!initialized) {
            alert("Can't contact google. Please check your internet connection.");
        } else {
            $("#textContainer").attr("style","");
            chartDuration = [];
            chartDistance = [];
            chartLabel = [];
            var work = $("#work").val();
            var home = $("#home").val();
            var makeRequest = function(){
                service.route({
                    origin: work,
                    destination: home,
                    travelMode: 'DRIVING',
                    unitSystem: google.maps.UnitSystem.METRIC,
                }, function(response, status) {
                    if (status !== 'OK') {
                        alert('Error was: ' + status);
                    } else {
                        console.log(response);
                        var distance = 0;
                        var duration = 0;
                        var routes = "";
                        var lastUpdate = (new Date()).toLocaleTimeString();

                        for (var i = 0; i < response.routes.length; i++) {
                            for (var j = 0; j < response.routes[i].legs.length; j++) {
                                distance += response.routes[i].legs[j].distance.value;
                                duration += response.routes[i].legs[j].duration.value;
                            }
                            if (routes=="") {
                                routes += response.routes[i].summary;
                            } else {
                                routes += ", "+response.routes[i].summary;
                            }
                        }

                        var distanceFormatted = (distance>=500)?((distance/1000).toFixed(2)+" km"):(distance+" m");
                        var durationFormatted = parseInt(duration/60)+" menit";

                        $("#distance").text(distanceFormatted);
                        $("#time").text(durationFormatted);
                        $("#routes").text(routes);
                        $("#last_update").text(lastUpdate);

                        generateChart(distance,parseInt(duration/60),lastUpdate);
                    }
                });
            };
            makeRequest();
            reloader = setInterval(makeRequest,1000*60*5);
        }
    });
});