google.charts.load('current', {
    'packages': ['corechart']
});

function createGoogleChart() {
    pivot.googlecharts.getData(
        {
            type: "pie"
        },
        drawChart,
        drawChart
    );
}

function drawChart(values) {
    var data = google.visualization.arrayToDataTable(values.data);

    var options = {
        title: "Розподіл піц за категорією",
        height: calculateHeight(),
        legend: {
            position: 'top'
        },
        fontSize: 18,
        is3D: true
    };

    var chart = new google.visualization.PieChart(document.getElementById("charts-component"));
    chart.draw(data, options);
}