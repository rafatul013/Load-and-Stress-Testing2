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

    var data = {"OkPercent": 99.99230769230769, "KoPercent": 0.007692307692307693};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3925, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.359, 500, 1500, "Get user"], "isController": false}, {"data": [0.4775, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.397, 500, 1500, "Login successfull"], "isController": false}, {"data": [0.3495, 500, 1500, "List Resource"], "isController": false}, {"data": [0.325, 500, 1500, "Update Request"], "isController": false}, {"data": [0.3425, 500, 1500, "Single user Request"], "isController": false}, {"data": [0.317, 500, 1500, "Register Successfull"], "isController": false}, {"data": [0.3595, 500, 1500, "Get Request"], "isController": false}, {"data": [0.195, 500, 1500, "Patch Request"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.3905, 500, 1500, "List User Request"], "isController": false}, {"data": [0.1185, 500, 1500, "Create Request"], "isController": false}, {"data": [0.4715, 500, 1500, "Single <Resource>"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 1, 0.007692307692307693, 1604.7616153846004, 0, 15583, 1406.0, 2821.8999999999996, 3220.0, 9884.97, 294.7845804988662, 293.1533446712018, 54.41769416099773], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get user", 1000, 0, 0.0, 1655.3849999999993, 56, 3029, 1407.0, 2783.0, 2870.85, 2914.98, 43.78283712784589, 77.53478683231174, 7.439661777583187], "isController": false}, {"data": ["Delete Request", 1000, 0, 0.0, 1173.4140000000007, 401, 15583, 1310.5, 1795.0, 1971.9499999999998, 3218.91, 28.314975790695698, 19.784481004190617, 5.309057960755443], "isController": false}, {"data": ["Login successfull", 1000, 0, 0.0, 1267.2270000000003, 400, 3271, 1678.5, 1833.9, 2870.8499999999917, 3149.95, 39.359231707797065, 30.190068189868935, 9.955118176093203], "isController": false}, {"data": ["List Resource", 1000, 0, 0.0, 1418.2359999999992, 59, 2920, 1406.0, 2619.9, 2785.95, 2905.99, 41.63717366865137, 61.888982608673025, 6.9124214098347005], "isController": false}, {"data": ["Update Request", 1000, 0, 0.0, 1443.5279999999982, 405, 3297, 1734.0, 2463.8, 2881.7499999999995, 3274.99, 45.357645031069985, 36.571018732707394, 10.53701502755477], "isController": false}, {"data": ["Single user Request", 1000, 0, 0.0, 1559.6529999999977, 57, 2933, 1368.0, 2795.0, 2871.8999999999996, 2915.0, 43.66621544910702, 46.80498054124274, 7.249274049168159], "isController": false}, {"data": ["Register Successfull", 1000, 0, 0.0, 1382.8320000000015, 401, 3301, 1698.0, 2007.6, 3065.8999999999996, 3254.95, 38.79878947776829, 30.031930191278033, 9.77547625514084], "isController": false}, {"data": ["Get Request", 1000, 0, 0.0, 1516.8120000000004, 405, 5894, 1748.0, 2984.7999999999993, 3174.8999999999996, 3275.96, 47.364183204660634, 36.84498664922086, 8.829211045919577], "isController": false}, {"data": ["Patch Request", 1000, 0, 0.0, 1688.962, 409, 3307, 1736.5, 2798.2, 3102.95, 3280.0, 44.26345609065156, 35.121582722866506, 9.50475590087199], "isController": false}, {"data": ["Debug Sampler", 1000, 0, 0.0, 0.08200000000000013, 0, 3, 0.0, 0.0, 1.0, 1.0, 30.913812291331766, 10.042641739829357, 0.0], "isController": false}, {"data": ["List User Request", 1000, 0, 0.0, 1553.5410000000004, 56, 3890, 1403.0, 2796.8, 2866.7999999999997, 2912.0, 44.193035177656, 79.77429788315361, 7.552520660243945], "isController": false}, {"data": ["Create Request", 1000, 1, 0.1, 4977.962000000001, 568, 10541, 3640.5, 9903.0, 9925.0, 9960.98, 51.255766273705795, 42.411093269477185, 11.95105274538698], "isController": false}, {"data": ["Single <Resource>", 1000, 0, 0.0, 1224.2670000000012, 56, 4005, 1365.0, 2255.7999999999993, 2704.85, 2893.0, 39.21568627450981, 40.15686274509804, 6.5870098039215685], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 100.0, 0.007692307692307693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Request", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
