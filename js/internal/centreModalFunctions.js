function drawCentreModalChart(totalRatings) {
    var ctx = document.getElementById("centreChart").getContext('2d');
    var data = {
        datasets: [{
            data: [totalRatings.Busy, totalRatings.Quiet, totalRatings.Average],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(26, 199, 25, 1)',
                'rgba(255, 206, 86, 1)'
            ]
        }],

        labels: [
            'Busy',
            'Quiet',
            'Average'
        ]
    };
    if (currentCentreChart) {
        currentCentreChart.destroy();
    }
    currentCentreChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    fontColor: 'rgb(255, 255, 255)'
                }
            }
        }
    });
}