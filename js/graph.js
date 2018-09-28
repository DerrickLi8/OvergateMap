var d3 = Plotly.d3;
var WIDTH_IN_PERCENT_OF_PARENT = 98,
    HEIGHT_IN_PERCENT_OF_PARENT = 80;

var gd3 = d3.select("div[id='graph']")
    .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
        height: HEIGHT_IN_PERCENT_OF_PARENT + '%'
    });

function createShopGraph() {
    var yValue = 0;
    if (curSelectedMarker) {
        yValue = allShopFloors[curSelectedMarker.id].databaseInfo.storeCurPopulation;
        console.log(yValue)
    }
    var time = new Date();

    var graph = gd3.node();

    var data = [{
        x: [time],
        y: [yValue],
        mode: 'lines',
        line: { color: '#80CAF6' }

    }]

    var update = {
        x: [[time]],
        y: [[yValue]]
    }

    var layout = {
        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 10,
            pad: 4
        },
        yaxis: {
            'tickformat': ',d'
        },
    };

    Plotly.plot('graph', data, layout, { displayModeBar: false, staticPlot: true });
}



function updateShopGraph() {
    console.log("update");
    if (!curSelectedMarker) {
        return;
    }
    var time = new Date();
    var curPopulation = allShopFloors[curSelectedMarker.id].databaseInfo.storeCurPopulation;
    var update = {
        x: [[time]],
        y: [[curPopulation]]
    }

    var olderTime = time.setMinutes(time.getMinutes() - 1);
    var futureTime = time.setMinutes(time.getMinutes() + 1);

    var minuteView = {
        xaxis: {
            type: 'date',
            range: [olderTime, futureTime]
        }
    };

    Plotly.relayout('graph', minuteView);
    Plotly.extendTraces('graph', update, [0]);
    window.onresize = function () { Plotly.Plots.resize(graph) };

}

function deleteShopGraph() {
    Plotly.purge('graph');
}



