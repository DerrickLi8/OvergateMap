function rand() {
    return Math.random();
}

var d3 = Plotly.d3;
var WIDTH_IN_PERCENT_OF_PARENT = 98,
    HEIGHT_IN_PERCENT_OF_PARENT = 80;

var gd3 = d3.select("div[id='graph']")
    .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
        height: HEIGHT_IN_PERCENT_OF_PARENT + '%'
    });


var time = new Date();

var graph = gd3.node();

var data = [{
    x: [time],
    y: [rand],
    fill: 'tozeroy',
    mode: 'lines',
    line: { color: '#80CAF6' }

}]

var layout = {
    autosize: true,

    margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 10,
        pad: 4
    },

};

Plotly.plot('graph', data, layout, { displayModeBar: false,  showAxisDragHandles: false, showAxisRangeEntryBoxes: false, staticPlot:true });


var cnt = 0;

var interval = setInterval(function () {


    var time = new Date();

    var update = {
        x: [[time]],
        y: [[rand()]]
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

    if (cnt === 100) clearInterval(interval);
}, 1000);
