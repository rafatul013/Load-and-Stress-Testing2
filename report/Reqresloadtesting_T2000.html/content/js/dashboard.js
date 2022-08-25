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

    var data = {"OkPercent": 98.76153846153846, "KoPercent": 1.2384615384615385};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15959615384615386, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05625, 500, 1500, "Get user"], "isController": false}, {"data": [0.282875, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.1485, 500, 1500, "Login successfull"], "isController": false}, {"data": [0.060125, 500, 1500, "List Resource"], "isController": false}, {"data": [0.081375, 500, 1500, "Update Request"], "isController": false}, {"data": [0.047, 500, 1500, "Single user Request"], "isController": false}, {"data": [0.0645, 500, 1500, "Register Successfull"], "isController": false}, {"data": [0.11125, 500, 1500, "Get Request"], "isController": false}, {"data": [0.05625, 500, 1500, "Patch Request"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.07375, 500, 1500, "List User Request"], "isController": false}, {"data": [0.022625, 500, 1500, "Create Request"], "isController": false}, {"data": [0.07025, 500, 1500, "Single <Resource>"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52000, 644, 1.2384615384615385, 3584.4702307692396, 0, 20125, 3181.0, 3882.0, 3988.0, 14212.900000000016, 5.686356331582811, 5.756520274669327, 1.03280732179342], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get user", 4000, 0, 0.0, 3206.3272500000044, 10, 11992, 3448.0, 3712.0, 4006.95, 5035.99, 0.43812411464700396, 0.7756991728381012, 0.07444687104353387], "isController": false}, {"data": ["Delete Request", 4000, 0, 0.0, 1925.0959999999945, 387, 6983, 1765.0, 3698.6000000000004, 3940.8999999999996, 4351.939999999999, 0.43776401958424893, 0.30590321257777014, 0.08208075367204667], "isController": false}, {"data": ["Login successfull", 4000, 0, 0.0, 2257.967500000001, 388, 19444, 2251.5, 3571.9, 3870.0, 4172.9299999999985, 0.4379724285406923, 0.33597083124155874, 0.11077622948441337], "isController": false}, {"data": ["List Resource", 4000, 0, 0.0, 3070.4239999999995, 10, 17085, 3261.5, 3924.9, 4252.0, 5003.0, 0.438019525377373, 0.6510788099239455, 0.07271808526772792], "isController": false}, {"data": ["Update Request", 4000, 0, 0.0, 3332.2087499999907, 390, 14063, 3525.0, 4228.0, 4889.249999999997, 5422.0, 0.43846168349117226, 0.3535564045056761, 0.10166348577559049], "isController": false}, {"data": ["Single user Request", 4000, 0, 0.0, 3156.920249999997, 10, 9413, 3420.0, 3650.0, 3824.95, 4984.9299999999985, 0.43806073142562263, 0.46932902730585857, 0.07272492611558189], "isController": false}, {"data": ["Register Successfull", 4000, 0, 0.0, 2697.718500000006, 389, 7780, 2742.5, 3842.9, 3956.0, 4099.879999999997, 0.43797218876601335, 0.3389408600678857, 0.11034846162268695], "isController": false}, {"data": ["Get Request", 4000, 3, 0.075, 4493.791000000002, 389, 14415, 3607.5, 11305.9, 12059.95, 13594.97, 0.4386158249519332, 0.3418181525792036, 0.08150704926220433], "isController": false}, {"data": ["Patch Request", 4000, 0, 0.0, 3360.3929999999978, 390, 6724, 3654.0, 3972.9, 4049.95, 4380.0, 0.43832316405329264, 0.3478137111759367, 0.09392646873462787], "isController": false}, {"data": ["Debug Sampler", 4000, 0, 0.0, 0.16274999999999953, 0, 121, 0.0, 0.0, 1.0, 1.0, 0.4378283233550434, 0.14316302066954678, 0.0], "isController": false}, {"data": ["List User Request", 4000, 0, 0.0, 3154.774999999996, 10, 13734, 3397.0, 3866.0, 3993.0, 6184.99, 0.4382119986389135, 0.7908498383600266, 0.07488974586114244], "isController": false}, {"data": ["Create Request", 4000, 641, 16.025, 13190.817999999957, 480, 20125, 14424.5, 18666.0, 19345.95, 19743.0, 0.4390370205894094, 0.46444382286025154, 0.08604964823393517], "isController": false}, {"data": ["Single <Resource>", 4000, 0, 0.0, 2751.511000000016, 10, 7910, 2783.5, 3655.9, 3826.95, 4910.149999999981, 0.43798849404226153, 0.448318007842184, 0.07356837985866112], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: reqres.in:443 failed to respond", 385, 59.78260869565217, 0.7403846153846154], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 172, 26.70807453416149, 0.33076923076923076], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 47, 7.298136645962733, 0.09038461538461538], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host closed connection during handshake", 40, 6.211180124223603, 0.07692307692307693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52000, 644, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: reqres.in:443 failed to respond", 385, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 172, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 47, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host closed connection during handshake", 40, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Request", 4000, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Request", 4000, 641, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: reqres.in:443 failed to respond", 385, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 169, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 47, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host closed connection during handshake", 40, "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
