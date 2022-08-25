/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.97948717948718, "KoPercent": 0.020512820512820513};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17864102564102563, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [3.333333333333333E-4, 500, 1500, "Get user"], "isController": false}, {"data": [0.30666666666666664, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.242, 500, 1500, "Login successfull"], "isController": false}, {"data": [0.005, 500, 1500, "List Resource"], "isController": false}, {"data": [0.109, 500, 1500, "Update Request"], "isController": false}, {"data": [0.0013333333333333333, 500, 1500, "Single user Request"], "isController": false}, {"data": [0.106, 500, 1500, "Register Successfull"], "isController": false}, {"data": [0.417, 500, 1500, "Get Request"], "isController": false}, {"data": [0.0, 500, 1500, "Patch Request"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "List User Request"], "isController": false}, {"data": [0.06833333333333333, 500, 1500, "Create Request"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "Single <Resource>"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19500, 4, 0.020512820512820513, 3106.5992307692195, 0, 19062, 2853.0, 5135.9000000000015, 5627.950000000001, 13837.920000000013, 365.798754408344, 363.54224433363663, 67.5165979719273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get user", 1500, 0, 0.0, 4116.341999999997, 1276, 12339, 4619.5, 4946.0, 4960.0, 4975.99, 50.571457469404265, 89.43539206575974, 8.593196874683928], "isController": false}, {"data": ["Delete Request", 1500, 0, 0.0, 1991.4120000000044, 386, 2930, 2695.0, 2794.8, 2830.95, 2888.0, 121.084920891185, 84.61439497901195, 22.70342266709719], "isController": false}, {"data": ["Login successfull", 1500, 0, 0.0, 2215.314666666665, 389, 3887, 2843.0, 3076.0, 3116.95, 3157.0, 99.25886712546321, 76.16696375397035, 25.105514243647434], "isController": false}, {"data": ["List Resource", 1500, 0, 0.0, 2772.8326666666653, 273, 12875, 2849.5, 3089.0, 3182.95, 3725.98, 73.52580755845302, 109.130536263541, 12.206432895446302], "isController": false}, {"data": ["Update Request", 1500, 0, 0.0, 2810.691333333331, 639, 5407, 2754.0, 4859.9, 5055.9, 5341.98, 47.8484162174232, 38.58227136431784, 11.115940949073336], "isController": false}, {"data": ["Single user Request", 1500, 0, 0.0, 3296.0053333333317, 515, 5523, 3222.0, 4108.9, 4651.8, 5132.840000000001, 59.49547834364588, 63.61127947505156, 9.877179021894337], "isController": false}, {"data": ["Register Successfull", 1500, 0, 0.0, 2657.2953333333317, 395, 15718, 3193.5, 3349.0, 3382.0, 3396.98, 84.26966292134831, 65.24051966292134, 21.232004915730336], "isController": false}, {"data": ["Get Request", 1500, 0, 0.0, 2187.1446666666648, 388, 14708, 1051.0, 5139.6, 5302.0, 5389.98, 51.21026936601687, 39.83845560496398, 9.546481054334096], "isController": false}, {"data": ["Patch Request", 1500, 0, 0.0, 4534.991999999995, 2074, 6529, 5111.5, 5395.9, 5403.0, 5626.99, 44.7053914702113, 35.47623116785385, 9.599929821849015], "isController": false}, {"data": ["Debug Sampler", 1500, 0, 0.0, 0.5313333333333327, 0, 111, 0.0, 0.0, 1.0, 1.0, 161.96954972465178, 52.680806945794195, 0.0], "isController": false}, {"data": ["List User Request", 1500, 0, 0.0, 4176.6940000000095, 2351, 11949, 4628.0, 4986.0, 4998.0, 5048.9, 44.33541217154849, 79.91891006931102, 7.576852666036119], "isController": false}, {"data": ["Create Request", 1500, 4, 0.26666666666666666, 7283.656666666667, 421, 19062, 7336.5, 14091.400000000001, 15966.5, 16864.98, 50.800961831544015, 42.19413455269753, 11.82524680800623], "isController": false}, {"data": ["Single <Resource>", 1500, 0, 0.0, 2342.878000000001, 78, 3272, 2529.0, 2726.0, 2750.0, 3195.99, 88.22491471591577, 90.10176192506765, 14.819028643688979], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, 75.0, 0.015384615384615385], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 1, 25.0, 0.005128205128205128], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19500, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Request", 1500, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
