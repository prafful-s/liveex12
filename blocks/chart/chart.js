
export default async function decorate(block) {
    const child = block.querySelector('div > div');
    const id = 'chart_div' + Math.random();
    console.log("id value is {}", id);
    //const anchorTag = block.querySelector('a');
    //const hrefValue = anchorTag.getAttribute('href');
    child.id = id;
    child.style.width = '100%';
    child.style.height = '500px';

    let timeSeries = [];
    const res = await fetch("https://mocki.io/v1/4e1f8e5d-ce6b-489c-ba42-468e05b0f9d4");
    const data = await res.json();

    console.log('data received {}', data);
    
    timeSeries = data['Time Series (15min)'];
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    console.log('draw chart calling');

    function drawChart() {
        var graphData = new google.visualization.DataTable();
        graphData.addColumn('string', 'Time');
        graphData.addColumn('number', 'Open');
        let minVal = 0;
        Object.keys(timeSeries).map(key => {
            let value = parseFloat(timeSeries[key]["1. open"]);
            if (minVal == 0) minVal = value;
            if (minVal > value) minVal = value;
            graphData.addRow([key.substring(11, key.length - 3).toString(), value]);
        });

        minVal = Math.floor(minVal);
        var options = {
            title: 'HDFC BANK',
            hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: minVal },
            tooltip: { trigger: 'hover' }
        };

        var chart = new google.visualization.AreaChart(document.getElementById(id));
        chart.draw(graphData, options);
    }
}
