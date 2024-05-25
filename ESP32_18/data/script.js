var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
var chart; // Define chart variable to store the Highcharts instance
var nilai = 0;
var dataCount = 100; // Maximum number of data points to display

// Init web socket when the page loads
window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
    initChart(); // Initialize the Highcharts chart
}

function getReadings(){
    websocket.send("getReadings");
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
    getReadings();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

function onMessage(event) {
    console.log("Received data:", event.data);
    var myObj = JSON.parse(event.data);
    var keys = Object.keys(myObj);

    const dataObj = JSON.parse(event.data);
    const dataArray = Object.values(dataObj).map(Number);

    console.log(dataArray[0]);
    nilai = dataArray[0];

    // Update Highcharts with the new nilai value
    var series = chart.series[0];
    var shift = series.data.length >= dataCount; // Shift if data length exceeds dataCount
    series.addPoint(nilai, true, shift);

    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        document.getElementById(key).innerHTML = myObj[key];
    }
}

function initChart() {
    chart = Highcharts.chart('container', {
        title: {
            text: 'Logarithmic axis demo'
        },
        xAxis: {
            tickInterval: 1,
            type: 'logarithmic',
            accessibility: {
                rangeDescription: 'Range: 1 to 10'
            }
        },
        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 0.1,
            accessibility: {
                rangeDescription: 'Range: 0.1 to 1000'
            }
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}'
        },
        series: [{
            name: 'Sensor Data',
            data: [],
            pointStart: 1
        }]
    });
}
