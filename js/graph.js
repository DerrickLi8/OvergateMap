/*

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

var yValue = 0;
var data = [{
    x: [time],
    y: [0],
    mode: 'lines',
    line: {color: '#80CAF6'}

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

Plotly.plot('graph', data, layout, { displayModeBar: false });


var cnt = 0;


var interval = setInterval(getNum, 500);


function getID(storeName,inIndex){
    //function to get storeID from database based on store name
    return $.ajax({
        url: 'backend_functions.php',
        type: 'POST',
        data: { funct:'storesGetIDByName', name:storeName, floor:0},
        index: inIndex,
        success: function(result){ console.log(this.index);setShopFloorDBID(result,this.index,); }
        });
}

//function for getting the number of people in store
function getNum() {
{
//funct for ajax call to backend
return $.ajax({
    url: 'backend_functions.php',
    type: 'POST',
    //needs a date included even if it`s not needed for the function
    // ! //			//recommended to push in the current date
    // ! //			//also needs the real store ID here
    data: { storeID: 1, funct: 'storeTrackerForDay', date: "2018-09-13" },
    success: function (response) {
        var time = new Date();
        console.log(response);
        var update = {
            x:  [[time]],
            y: [[response]]
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
    }
});
}
}

*/