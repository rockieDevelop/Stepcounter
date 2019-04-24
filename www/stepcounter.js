/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//var podojs = require("./js/podo.js");
//var aesjs = require('aes-js');

var devicereadyRunning = false;

var Latitude = undefined;
var Longitude = undefined;
var points = [];
var lineToPush = [];
var lines = [];
//var mapPosition = [18.560734, 49.866528]; //Karvina
var mapPosition = [19.564321, 48.542229]; //Lesy
var myMap;
var connectedAddr;
var scannedDevice;

var currentDate;
var lastTimeSent;
var startStepcounterDate;
var oldNumberOfSteps;

var podo;
var podo_stepSize;
var podo_weight;
var podo_height;
var podo_step;
var podo_speed;
var podo_calory;
var isGPSEnabled;
var distance, meanSpeed, calory;
var week = 1000*60*60*24*7;

function dropdown() {
  //document.getElementById("myDropdown").classList.toggle();
  $("#myDropdown").toggle();
}

var margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 20
}
var h = $(window).height();
var w = $(window).width(); 
var svgWidth = w - margin.right - margin.left;
var svgHeight = (h/2) - margin.top - margin.bottom;
var barPadding = 3;
//bar chart
/*var createBarChart = function(data,divID){
    var barWidth = (svgWidth/data.length);

    var tooltip = d3.select("body")
            .append("div")
            .style("position","absolute")
            .style("background","f4f4f4")
            .style("padding", "5 15px")
            .style("border", "1px #333 solid")
            .style("border-radius", "5px")
            .style("opacity", "0");

    var colors = d3.scaleLinear()
            .domain([0,data.length])
            .range(["#90ee90", "#30c230"])

    var yScale = d3.scaleLinear()
            .domain([0,d3.max(data)])
            .range([0,svgHeight]);

    var xScale = d3.scaleLinear()
            .domain([0,d3.max(data)])
            .range([0,svgWidth]);

    var svg = d3.select('#'+divID)
            .append('svg')
            .attr("width", svgWidth + margin.right + margin.left)
            .attr("height", svgHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .style("background", "#f4f4f4");

    var barChart = svg.selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .style("fill", function(d,i){
                return colors(i)
            })
            .attr("y", function(d){
                return svgHeight - yScale(d);
            })
            .attr("height", function(d){
                return yScale(d);
            })
            .attr("width", barWidth - barPadding)
            .attr("transform", function(d,i){
                var translate = [barWidth * i, 0];
                return "translate("+translate+")";
            })
            .on("mouseover", function(d){
                tooltip.transition()
                    .style("opacity",1)

                tooltip.html(d)
                    .style("left",""+d3.event.pageX+"px")
                    .style("top",""+d3.event.pageY+"px")
                d3.select(this).style("opacity",0.5)
            })
            .on("mouseout",function(d){
                tooltip.transition()
                    .style("opacity",0)
                d3.select(this).style("opacity",1)
            })

    var verticalScale = d3.scaleLinear()
            .domain([0,d3.max(data)])
            .range([svgHeight,0]);

    var horizontalScale = d3.scaleBand()
        .domain(d3.range(0, data.length))
        .range([0, svgWidth])

    var xAxis = d3.axisBottom()
            .scale(horizontalScale)
            .ticks(data.size)

    var yAxis = d3.axisLeft()
            .scale(verticalScale)
            .ticks(5)

    svg.append("g")
            .call(yAxis)

    svg.append("g")
            .attr("transform", "translate(0," + svgHeight +")")
            .call(xAxis)
}*/
//pie chart -- data: array of arrays with 2 items ([["a",1],["b",2]])
/*var createPieChart = function(data,divID){
    var total = 0;
    for(var i = 0 ; i < data.length; i++){
        total += data[i][1];
    }

    var width = w, height = svgHeight;
    var radius = width/3;
    var colors = d3.scaleOrdinal()
            .range(["#FF7F50","#6495ED","#FFF8DC","#DC143C","#008B8B","#006400"]);
    var svg = d3.select("#"+divID).append("svg")
            .attr("width",width)
            .attr("height",height);
    var data = d3.pie()
            .sort(null)
            .value(function(d){ return d[1]; })(data);
    var segments = d3.arc()
            .innerRadius(0)
            .outerRadius(svgWidth/3); 
    var sections = svg.append("g")
            .attr("transform","translate("+ svgWidth/3+20 +","+ svgWidth/3+20 +")")
            .selectAll("path")
            .data(data);
    sections.enter().append("path").attr("d",segments)
            .attr("fill",function(d){ return colors(d.index); });

    var legends = svg.append("g")
            .attr("transform","translate("+ (2*svgWidth/3 + 20) +",0)")
            .selectAll(".legends")
            .data(data);
    var legend = legends.enter().append("g").classed("legends",true)
            .attr("transform",function(d,i){ return "translate(0,"+(i+1)*20+")"; });
    legend.append("rect")
            .attr("width",15)
            .attr("height",15)
            .attr("fill",function(d){ return colors(d.index); });
    legend.append("text").classed("legendLabel",true).text(function(d){ return d.data[0] + " " +(d.data[1]*100/total).toFixed(0)+"%"; })
            .attr("fill", function(d){ return colors(d.index); })
            .attr("x",15)
            .attr("y",13);
}*/

function createPieChart2(data,divID,title) {
    var div = document.getElementById(divID);
    console.log("creating pie chart");
    div.style.height = (h/2)-30 +'px';
    div.style.width = w-30 +'px';
    Highcharts.chart(divID, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Share',
            colorByPoint: true,
            data: data
        }]
    });
}

//data - array of arrays [time,data]
function createGraph(data,divID,title,yAxisName) {
    var div = document.getElementById(divID);
    console.log("creating graph");
    div.style.height = (h/2)-30 +'px';
    div.style.width = w-30 +'px';
    Highcharts.setOptions({
        time: {
            //timezone: 'Europe/Prague' //+01
            //timezone: 'Europe/Kaliningrad' //+02
            timezone: 'Europe/Moscow' //+03
        }
    });
    Highcharts.chart(divID, {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: title
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: yAxisName
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'steps in time',
            data: data
        }]
    });
}


class Map{
    constructor(target, position, zoom)
    {
        console.log("New map init")
        this.Target = target;
        this.Position = position;
        this.Zoom = zoom;

        console.log("Creating backround layer")
        this.Raster = new ol.layer.Tile({
            source: new ol.source.OSM(),
          });

        console.log("Creating new vector source");
        this.Source = new ol.source.Vector({wrapX: false});

        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color : "yellow",
                width: 10})
        });

        console.log("Creating new vector layer");
        this.Vector = new ol.layer.Vector({
            source: this.Source,
            style: style
          });

        console.log("Creating map");
        // Adding map to object
        this.Map = new ol.Map({
            layers: [this.Raster, this.Vector],
            target: this.Target,
            view: new ol.View({
              center: this.Position,
              zoom: this.Zoom,
              projection: 'EPSG:4326'//new OpenLayers.Projection('EPSG:4326')
            }),
        });
        console.log(this.Target);
        console.log(this.Position);
        console.log(this.Zoom);
        console.log(this.Raster);
        console.log(this.Source);
        console.log(this.Vector);
        console.log(this.Map);

        // LayerPointObjectHolder delete when you drop drawing
        this.Draw = null;
    }

    // types: 'Point', 'LineString', 'Polygon', 'Circle', 
    /*AddInteraction: function(type)
    {
        if(type !== 'None')
        {
            // Create a visible representation of source
            this.Draw = new ol.interaction.Draw({
                source: this.Source,
                type:  (type)
            });
            // Draws to map
            this.Map.addInteraction(this.Draw);
        }
    },*/

    Clear()
    {
        //this.Map.removeInteraction(this.Draw);
        //this.Draw = null;
        this.Source.clear();
    }

    Add(data)
    {
        this.Source.addFeature(new ol.Feature( new ol.geom.LineString(data) ));
    }
}


var currentDayHelp = new Date();
currentDayHelp = new Date(currentDayHelp.getFullYear(),currentDayHelp.getMonth(),currentDayHelp.getDate());
var currentDay = currentDayHelp.getTime();





function createLoader(){
    $('#myLoader').empty();
    var loader = document.getElementById("myLoader");
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'loader');
    newDiv.setAttribute('id', 'loaderNew');
    loader.appendChild(newDiv);
}





function saveStepcounterDataLocalStorage(data)
{
    var todayD = new Date();
    todayD = new Date(todayD.getFullYear(),todayD.getMonth(),todayD.getDate());
    var today = todayD.getTime();
    var a = JSON.parse(localStorage.getItem('stepsData'));
    if(a){
        // Push the new data (whether it be an object or anything else) onto the array
        var pushed = false;
        for(var i = 0; i < a.length; i++){
            if(a[i].day <= today - week){
                a.shift();
            }
            else if(a[i].day == today){
                pushed = true;
                a[i].data = data;
            }
        }
        if(!pushed){
            a.push({day:today,data:data});
        }
        localStorage.setItem('stepsData', JSON.stringify(a));
    }else{
        //a = [data];
        a = [{day:today,data:data}];
        localStorage.setItem('stepsData', JSON.stringify(a));
    }
}

var app = {
    
    initialize: function() {
        lineToPush = [];
        lines = [];
        
        podo_stepSize = localStorage.podo_stepSize || 50;
	podo_weight = localStorage.podo_weight || 70;
        podo_height = localStorage.podo_height || 175;
        let retrievedObject = localStorage.getItem('stepsData');
        var obj,objH;
        if(retrievedObject){
            objH = JSON.parse(retrievedObject);
            let todayD = new Date();
            todayD = new Date(todayD.getFullYear(),todayD.getMonth(),todayD.getDate());
            let today = todayD.getTime();
            for(var i = 0; i < objH.length; i++){
                if(objH[i].day == today){
                    obj = objH[i].data;
                }
            }
        }
        if(obj == null){
            podo_step = 0;
            podo_speed = 0;
            podo_calory = 0;
            let dateObject = {
                step:podo_step,
                speed:podo_speed,
                calory:podo_calory,
                stepSize:podo_stepSize,
                weight:podo_weight,
                height:podo_height
            };
            saveStepcounterDataLocalStorage(dateObject);
        }
        else{ 
            podo_step = obj.step;
            podo_speed = obj.speed;
            podo_calory = obj.calory;
        }
        
        //create table of stepsinfo from last 7 days
        $('#historyButton').on('click',function(){
            createHistoryTable();
        });
        function createHistoryTable(){
            let retrievedObjectH = localStorage.getItem('stepsData');
            var objFromStorage = JSON.parse(retrievedObjectH);
            $('#daysTable').empty();
            function createTable (){
                var table = $('<table>');
                for(var i = 0; i < objFromStorage.length;i++)
                {
                    var dayDate = new Date(parseInt(objFromStorage[i].day));
                    var column = $('<tr>');
                    column.append($('<td>').append('<button type="button" value='+objFromStorage[i].data.step+'>'+dayDate.getDate()+"/"+(dayDate.getMonth() + 1)+"/"+dayDate.getFullYear()+'</button>')); 
                    column.data("steps", objFromStorage[i].data.step);
                    table.append(column);
                }
                return table;
            }
            $(function (){
                $('#daysTable').append(createTable());
                $('#daysTable table button').click(function (){
                    var stepsCount = document.getElementById("selectedDaySteps");
                    $("#selectedDaySteps").html($(this).parent().parent().data('steps'));
                })
            });
        }
        createHistoryTable();
        
        navigator.geolocation.getCurrentPosition(function (pos) {
            if (pos.coords.latitude == null) {
                isGPSEnabled = false;
            } else {
                isGPSEnabled = true;
            }
            podo.setIsGPSEnabled(Boolean(isGPSEnabled));
        });
        podo = new Pedometer();
        
        //init pedometer
        podo.setCountStep(Math.round(podo_step));
	podo.setWeight(Math.round(podo_weight));
	podo.setStepSize(Math.round(podo_stepSize));
	podo.setMeanSpeed(Math.round(podo_speed*1000.)/1000.);
	podo.setCalory(Math.round(podo_calory*1000.)/1000.);
        
        if(!devicereadyRunning){
            devicereadyRunning = true;
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        }
    },
    
    encrypt: function(textBytes){
        var key = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42, 0x43, 0x44, 0x45];
        var aesEcb = new aesjs.ModeOfOperation.ecb(key);
        var encryptedBytes = aesEcb.encrypt(textBytes);
        var u8 = new Uint8Array(2);
        u8[0] = 0x03;
        u8[1] = 0x08;
        res = concatBytes(u8, encryptedBytes);
        return res; 

        function concatTypedArrays(a, b) {// a, b TypedArray of the same type
            var c = new(a.constructor)(a.length + b.length);
            c.set(a, 0);
            c.set(b, a.length);
            return c;
        }

        function concatBytes(ui8a, bytes) {
            var b = new Uint8Array(bytes.length);
            for (var i = 0, only = bytes.length; i <only; i ++) {
                b[i] = bytes[i];
            }
            return concatTypedArrays(ui8a, b);
        }
    }, 
    
    onDeviceReady: function() {
        var dataObject; //Object read from file
        window.screen.orientation.lock('portrait');
        /*var backgroundSuccess = function(){
            console.log("backgroundService");
        }
        var backgroundError = function(){
            console.log("backgroundService error");
        }
        window.BackgroundService.start(backgroundSuccess, backgroundError); */
        
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.on('activate', function() {
            cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
         });
        
        
        function checkConnection() {
            var networkState = navigator.connection.type;
            
            var isDeviceConnected = false;
            var connectionStates = {};
            connectionStates[Connection.UNKNOWN]  = 'Unknown connection';
            connectionStates[Connection.ETHERNET] = 'Ethernet connection';
            connectionStates[Connection.WIFI]     = 'WiFi connection';
            connectionStates[Connection.CELL_2G]  = 'Cell 2G connection';
            connectionStates[Connection.CELL_3G]  = 'Cell 3G connection';
            connectionStates[Connection.CELL_4G]  = 'Cell 4G connection';
            connectionStates[Connection.CELL]     = 'Cell generic connection';
            connectionStates[Connection.NONE]     = 'No network connection';
            if(networkState == Connection.NONE){
                isDeviceConnected = false;
            }
            else{
                isDeviceConnected = true;
            }
            //console.log('Connection type: ' + connectionStates[networkState]);
            return isDeviceConnected;
        }
        
        
        if(localStorage.getItem("connectedAddr")){
            connectedAddr = localStorage.getItem("neco");
        }
        
        $('#hrefHome').on('click',function(){
            $('#downloadButton').hide();
            $('#scanButton').hide();
            $('#historyButton').show();
            $('#mapButton').hide();
            $('#gpxButton').show();
            $('.pages').hide();
            $('#HomePage').show();
        });
        $('#hrefMap').on('click',function(){
            $('#downloadButton').hide();
            $('#scanButton').hide();
            $('#historyButton').hide();
            $('#mapButton').show();
            $('#gpxButton').hide();
            $('.pages').hide();
            $('#MapPage').show();
            loadM();
        });
        $('#hrefDevices').on('click',function(){
            loadD();
            $('#downloadButton').hide();
            $('#scanButton').show();
            $('#historyButton').hide();
            $('#mapButton').hide();
            $('#gpxButton').hide();
            $('.pages').hide();
            $('#DevicesPage').show();
        });
        $('#hrefDevice').on('click',function(){
            loadB();
            $('#downloadButton').show();
            $('#scanButton').hide();
            $('#historyButton').hide();
            $('#mapButton').hide();
            $('#gpxButton').hide();
            $('.pages').hide();
            $('#BTDevicePage').show();
        });
        
        //CREATE, WRITE, READ, REMOVE LOCAL FILE
        function createFile(name) {
            var type = window.PERSISTENT;
            var requestedBytes = 1024*1024*40; //40MB
            navigator.webkitPersistentStorage.requestQuota (
                requestedBytes, function(grantedBytes) {  
                    window.requestFileSystem(type, grantedBytes, onInitFs, errorHandler);
                }, function(e) { console.log('Error', e); }
            );
            function onInitFs(fs) {
                fs.root.getFile(name, {create: true, exclusive: true}, function(fileEntry) { //'deviceData.txt'
                   console.log('File creation successfull!');
                }, errorHandler);
             }

             function errorHandler(error) {
                console.log("ERROR: " + JSON.stringify(error));
             }
         }
         function writeFile(name,obj) {
            var type = window.PERSISTENT;
            var size = 40*1024*1024;
            window.requestFileSystem(type, size, successCallback, errorCallback)

            function successCallback(fs) {
               fs.root.getFile(name, {create: true}, function(fileEntry) {

                  fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };
                    //adding to the end of file(no rewriting but adding)
                    /*try {
                        fileWriter.seek(fileWriter.length);
                    }
                    catch (e) {
                        console.log("file doesn't exist!");
                    }*/
                    var blob = new Blob([JSON.stringify(obj)], {type : 'application/json'});
                    fileWriter.write(blob);
                  }, errorCallback);
               }, errorCallback);
            }

            function errorCallback(error) {
               console.log("ERROR: " + JSON.stringify(error))
            }
         }
         function createGPXFile(){
            createLoader();
            //create file
            //createFile("tracks.xml"); 
             
            //generate file
            var doc = document.implementation.createDocument("", "", null);
            var gpx = doc.createElement("gpx");
            gpx.setAttribute("version","1.1");
            gpx.setAttribute("creator","safranek vsb");
            gpx.setAttribute("xmlns","http://www.topografix.com/GPX/1/1");
            gpx.setAttribute("xmlns:nmea","http://trekbuddy.net/2009/01/gpx/nmea");
            //version 1.0
            /*var lineColors = ["FAEBD7","00FFFF","7FFFD4","0000FF","8A2BE2","A52A2A","7FFF00","000000"];
            //var retrievedObject = localStorage.getItem('stepsData');
            var a = JSON.parse(localStorage.getItem('mapCoords'));
            if(a){
                for(var i = 0; i < a.length; i++){
                    var trk = doc.createElement("trk");
                    var n = doc.createElement("name");
                    let d = new Date(a[i].day);
                    n.innerHTML = "Track "+d.getFullYear()+"/"+d.getDate()+"/"+(d.getMonth()+1);
                    trk.appendChild(n);
                    
                    var stepsEx = doc.createElement("extensions");
                    var stepsE = doc.createElement("steps");
                    var stepsArr = JSON.parse(localStorage.getItem('stepsData'));
                    var stepsCount = 0;
                    if(stepsArr){
                        for(var i2 = 0; i2 < stepsArr.length; i2++){
                            if(stepsArr[i2].day == a[i].day){
                                stepsCount = stepsArr[i2].data.step;
                            }
                        }
                    }
                    stepsE.innerHTML = stepsCount;
                    stepsEx.appendChild(stepsE);
                    trk.appendChild(stepsEx);

                    var extensions = doc.createElement("extensions");
                    var line = doc.createElement("line");
                    line.setAttribute("xmlns","http://www.topografix.com/GPX/gpx_style/0/2");
                    var c = doc.createElement("color");
                    c.innerHTML = lineColors[i];
                    line.appendChild(c);
                    extensions.appendChild(line);
                    trk.appendChild(extensions);

                    var trkseg = doc.createElement("trkseg");
                    for(var j = 0; j < a[i].data.length; j++){
                        //if(j == 0){
                        //    var wpt1 = doc.createElement("wpt");
                        //    wpt1.setAttribute("lat",a[i].data[j][1]);
                        //    wpt1.setAttribute("lon",a[i].data[j][0]);
                        //    wpt1.setAttribute("name","start");
                        //    gpx.appendChild(wpt1);
                        //}
                        //else if(j == a[i].data.length - 1){
                        //    var wpt2 = doc.createElement("wpt");
                        //    wpt2.setAttribute("lat",a[i].data[j][1]);
                        //    wpt2.setAttribute("lon",a[i].data[j][0]);
                        //    wpt2.setAttribute("name","end");
                        //    gpx.appendChild(wpt2);
                        //} 
                        var trkpt1 = doc.createElement("trkpt");
                        trkpt1.setAttribute("lat",a[i].data[j][1]);
                        trkpt1.setAttribute("lon",a[i].data[j][0]);
                        trkseg.appendChild(trkpt1);
                    }
                    trk.appendChild(trkseg);
                    gpx.appendChild(trk);
                }
            }
            doc.appendChild(gpx);*/
            //version 1.1
            var a = JSON.parse(localStorage.getItem('mapCoords'));
            if(a){
                for(var i = 0; i < a.length; i++){
                    var trk = doc.createElement("trk");
                    var n = doc.createElement("name");
                    let d = new Date(a[i].day);
                    n.innerHTML = "Track "+d.getFullYear()+"/"+d.getDate()+"/"+(d.getMonth()+1);
                    trk.appendChild(n);
                    
                    var stepsEx = doc.createElement("extensions");
                    var stepsE = doc.createElement("steps");
                    var stepsArr = JSON.parse(localStorage.getItem('stepsData'));
                    var stepsCount = 0;
                    if(stepsArr){
                        for(var i2 = 0; i2 < stepsArr.length; i2++){
                            if(stepsArr[i2].day == a[i].day){
                                stepsCount = stepsArr[i2].data.step;
                            }
                        }
                    }
                    stepsE.innerHTML = stepsCount;
                    stepsEx.appendChild(stepsE);
                    trk.appendChild(stepsEx);

                    var trkseg = doc.createElement("trkseg");
                    for(var j = 0; j < a[i].data.length; j++){
                        var trkpt1 = doc.createElement("trkpt");
                        trkpt1.setAttribute("lat",a[i].data[j][1]);
                        trkpt1.setAttribute("lon",a[i].data[j][0]);
                        var extensions2 = doc.createElement("extensions");
                        var nmeaSpeed = doc.createElement("nmea:speed");
                        nmeaSpeed.innerHTML = a[i].data[j][2];
                        var nmeaCourse = doc.createElement("nmea:course");
                        nmeaCourse.innerHTML = a[i].data[j][3];
                        extensions2.appendChild(nmeaSpeed);
                        extensions2.appendChild(nmeaCourse);
                        trkpt1.appendChild(extensions2);
                        trkseg.appendChild(trkpt1);
                    }
                    trk.appendChild(trkseg);
                    gpx.appendChild(trk);
                }
            }
            doc.appendChild(gpx);
            docWrite = new XMLSerializer().serializeToString(doc);
            
            //write file
            setTimeout(function(){
                console.log(cordova.file);
                var fileName = "tracks.xml";
                
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                    var isAppend = false;
                    //create file
                    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
                        //write file
                        writeFileCordova(fileEntry, docWrite, isAppend);
                    }, errorCallback);
                }, errorCallback);
                
                function writeFileCordova(fileEntry, dataObj, isAppend) {
                    // Create a FileWriter object for our FileEntry (log.txt).
                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.onwriteend = function() {
                            console.log("Successful file write...");
                            alert("GPX file created at "+ cordova.file.externalDataDirectory);
                            //readFile(fileEntry);
                            $('#myLoader').empty();
                        };

                        fileWriter.onerror = function (e) {
                            console.log("Failed file write: " + e.toString());
                            $('#myLoader').empty();
                        };

                        // If we are appending data to file, go to the end of the file.
                        if (isAppend) {
                            try {
                                fileWriter.seek(fileWriter.length);
                            }
                            catch (e) {
                                console.log("file doesn't exist!");
                            }
                        }
                        fileWriter.write(dataObj);
                    });
                }              

                function errorCallback(error) {
                    console.log("ERROR GPX: " + JSON.stringify(error));
                    $('#myLoader').empty();
                }
            },1000);
        }
        
         function readFile(name) {   
            var type = window.PERSISTENT;
            var size = 40*1024*1024;
            window.requestFileSystem(type, size, successCallback, errorCallback)

            function successCallback(fs) {
               fs.root.getFile(name, {}, function(fileEntry) {

                  fileEntry.file(function(file) {
                     var reader = new FileReader();

                     reader.onloadend = function(e) {
                        console.log("read succes"); 
                        dataObject = this.result;
                        dataObject = JSON.parse(dataObject);
                     };
                     reader.readAsText(file);
                  }, errorCallback);
               }, errorCallback);
            }

            function errorCallback(error) {
               console.log("ERROR: " + JSON.stringify(error));
            }
         }
         function removeFile(name) {
            var type = window.PERSISTENT;
            var size = 40*1024*1024;
            window.requestFileSystem(type, size, successCallback, errorCallback)

            function successCallback(fs) {
               fs.root.getFile(name, {create: false}, function(fileEntry) {

                  fileEntry.remove(function() {
                     console.log('File removed.');
                  }, errorCallback);
               }, errorCallback);
            }

            function errorCallback(error) {
               console.log("ERROR: " + JSON.stringify(error))
            }
         }
        //removeFile('deviceData.txt');
        //localStorage.removeItem("notificationTime");
        
        
        
        $('#gpxButton').on('click',function(){
            createGPXFile();
        });
        //DEVICES STEPCOUNTER
        var successCheckStepcounter = function(data){           
            console.log("counting steps begin");
            var dateObject = {
                step:podo_step,
                speed:podo_speed,
                calory:podo_calory,
                stepSize:podo_stepSize,
                weight:podo_weight,
                height:podo_height
            };
            if(data){
                console.log("using stepcounter");
                //CORDOVA PLUGIN PEDOMETER         
                var distanceAvailable = false;
                var floorCountingAvailable = false;
                
                pedometer.isDistanceAvailable(function(data){
                    if(data){
                        distanceAvailable = true;
                    }
                }, function(){});
                pedometer.isFloorCountingAvailable(function(data){
                    if(data){
                        floorCountingAvailable = true;
                    }
                }, function(){});
                
                var successHandler = function (pedometerData) {  
                    var controlDate = new Date();
                    if(currentDay + 1000*60*60*24 < controlDate.getTime()){
                        controlDate = new Date(controlDate.getFullYear(),controlDate.getMonth(),controlDate.getDate());
                        currentDay = controlDate.getTime();
                        app.initialize();
                    }
                    
                    let startDate = pedometerData.startDate; //-> ms since 1970
                    let endDate = pedometerData.endDate; //-> ms since 1970
                    let numberOfSteps = pedometerData.numberOfSteps;
                    console.log(JSON.stringify(pedometerData));
                    console.log("steps " + numberOfSteps);
                    let retrievedObject = localStorage.getItem('stepsData');
                    var dObject ={};
                    var obj;
                    if(retrievedObject){
                        let objH = JSON.parse(retrievedObject);
                        let todayD = new Date();
                        todayD = new Date(todayD.getFullYear(),todayD.getMonth(),todayD.getDate());
                        let today = todayD.getTime();
                        for(var i = 0; i < objH.length; i++){
                            if(objH[i].day == today){
                                obj = objH[i].data;
                            }
                        }
                    }
                    if(obj == null){
                        dObject = {
                            step:numberOfSteps,
                            speed:0,
                            calory:0,
                            stepSize:podo_stepSize,
                            weight:podo_weight,
                            height:podo_height
                        };
                        saveStepcounterDataLocalStorage(dObject);
                    }
                    else{
                        var numberOfStepsSave;
                        if(startDate == startStepcounterDate){
                            numberOfStepsSave = obj.step + (numberOfSteps - oldNumberOfSteps);
                        }
                        else{
                            numberOfStepsSave = obj.step + numberOfSteps;
                        }
                        dObject = {
                            step:numberOfStepsSave,
                            speed:0,
                            calory:0,
                            stepSize:podo_stepSize,
                            weight:podo_weight,
                            height:podo_height
                        };
                        saveStepcounterDataLocalStorage(dObject);
                    }
                    startStepcounterDate = startDate;
                    oldNumberOfSteps = numberOfSteps;
                    let distance;
                    distance = (dObject.step * podo_stepSize) / 100;
                    /*if(distanceAvailable){
                        distance = pedometerData.distance; //predelat
                    }   
                    else{
                        distance = (dObject.step * podo_stepSize) / 100;
                    }
                    
                    let floorsAsc = null;
                    let floorsDesc = null;
                    if(floorCountingAvailable){
                        floorAsc = pedometerData.floorsAscended;
                        FloorDesc = pedometerData.floorsDescended;
                    }*/
                    
                    var stepsDiv = document.getElementById("stepsCount");
                    var distanceDiv = document.getElementById("distanceCount");
                    var caloriesDiv = document.getElementById("caloriesCount");
                    var speedDiv = document.getElementById("speedCount");
                    stepsDiv.innerHTML = dObject.step;
                    distanceDiv.innerHTML = distance + "m"; 
                    caloriesDiv.innerHTML = 0 + "cal"; //can't count from inner stepcounter
                    speedDiv.innerHTML = 0 + "km/h"; //can't count from inner stepcounter

                    var quest = 5000; //5000 steps per day
                    var width = (dObject.step / quest)*100;
                    if(width >= 100)
                        width = 100;
                    var progressBar = document.getElementById("progressBar");
                    progressBar.style.width = parseFloat((width).toFixed(2)) + '%'; 
                    progressBar.innerHTML = parseFloat((width).toFixed(2))  + '%';
                };
                var onError = function(er){
                    alert("Something wrong with Pedometer, can't start counting steps.");
                }
                pedometer.startPedometerUpdates(successHandler, onError);
            }
            //own code
            else{  
                console.log("using own code");
                var norm = 0;
                if (window.DeviceOrientationEvent) {
                    window.addEventListener("devicemotion", function( event ) {
                        var controlDate = new Date();
                        if(currentDay + 1000*60*60*24 < controlDate.getTime()){
                            controlDate = new Date(controlDate.getFullYear(),controlDate.getMonth(),controlDate.getDate());
                            currentDay = controlDate.getTime();
                            app.initialize();
                        }
                        
                        if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2))
                        {
                            podo.createTable(Math.round(2/(event.interval/1000)));
                        }
                        else{
                            norm = podo.computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
                            podo.acc_norm.push(norm);
                            
                            podo.update();
				
                            podo.onStep(podo.acc_norm);
                            podo.onSpeed();
                            podo.onCalory();
                            //localStorage.clear();
                            
                            let podo_stepBefore = podo_step;
                            if (isNaN(podo.countStep) == 0)
                            {
                                podo_step = dateObject.step = podo.countStep;
                            }
                            if (isNaN(podo.meanSpeed) == 0)
                            {
                                podo_speed = dateObject.speed = podo.meanSpeed;
                            }
                            if (isNaN(podo.calory) == 0)
                            {
                                podo_calory = dateObject.calory = podo.calory;
                            }
                            
                            if (isNaN(podo.distance) == 0){
                                distance = Math.round(podo.distance/100); //m
                            } else {
                                distance = 0;
                            };
                            if (isNaN(podo.meanSpeed) == 0){
                                meanSpeed = Math.round(podo.meanSpeed/1000*3600); //km/h
                            } else {
                                meanSpeed = 0;
                            };
                            if (isNaN(podo.calory) == 0){
                                calory = Math.round(podo.calory); //km/h
                            } else {
                                calory = 0;
                            };
                            //var neco = document.getElementById("test");
                            if(podo_stepBefore != podo_step){
                                var stepsDiv = document.getElementById("stepsCount");
                                var distanceDiv = document.getElementById("distanceCount");
                                var caloriesDiv = document.getElementById("caloriesCount");
                                var speedDiv = document.getElementById("speedCount");
                                stepsDiv.innerHTML = podo_step;
                                distanceDiv.innerHTML = distance + "m"; 
                                caloriesDiv.innerHTML = calory + "cal";
                                speedDiv.innerHTML = meanSpeed + "km/h";
                                
                                var quest = 5000; //5000 steps per day
                                var width = (podo_step / quest)*100;
                                if(width >= 100)
                                    width = 100;
                                var progressBar = document.getElementById("progressBar");
                                progressBar.style.width = parseFloat((width).toFixed(2)) + '%'; 
                                progressBar.innerHTML = parseFloat((width).toFixed(2))  + '%';
                                
                                saveStepcounterDataLocalStorage(dateObject);
                            }   
                        }
                    }, false);
                }
                else{
                    alert("This device cannot count steps");
                }
            }
        }
        var errorCheckStepcounter = function(er){
            alert("This device cannot count steps");
        }
        
        //stepcounter.deviceCanCountSteps(successCheckStepcounter, errorCheckStepcounter);
        pedometer.isStepCountingAvailable(successCheckStepcounter, errorCheckStepcounter);
        
        
        
        
        
        
        
        
        
        
        //BLUETOOTH CONNECT - DEVICES PAGE
        
        var devices = [];
        function stopScanning(){
            devices = [];
            bluetoothle.stopScan(stopScanSuccessCallback, stopScanErrorCallback);
            bluetoothle.disconnect(disconnectSuccessCallback,disconnectErrorCallback,scannedDevice);
            $('#myLoader').empty();
        }
            
        var initializeSuccessCallback = function(data){
            //CREATE DEVICES TABLE
            $('#devicesTable').empty();
            var table = $('<table>');
            var startScanSuccessCallback = function(data){
                //SCANNING DEVICES
                if(data.status == "scanResult"){
                    var repeat = false;
                    devices.forEach(function(element) {
                        if(element.address == data.address){
                            repeat = true;
                        }
                    });
                    if(!repeat){
                        var BTdevice = {
                            address: data.address,
                            name: data.name,
                            rssi: data.rssi,
                            advertisement: data.advertisement,
                        }
                        var param = {
                            address: BTdevice.address
                        }
                        scannedDevice = param;
                        //alert(bluetoothle.encodedStringToBytes(data.advertisement) + " name:"+ data.name);
                        bluetoothle.connect(function(data){
                            connectedAddr = data.address;
                            bluetoothle.discover(function(data){
                                //CHECK SERVICES OF DEVICES
                                data.services.forEach(function(el)
                                {
                                    for (let e of el.characteristics) {
                                        if(e.uuid.toLowerCase() == "00000005-0000-3512-2118-0009af100700" || e.uuid.toLowerCase() == "00000007-0000-3512-2118-0009af100700"){
                                            console.log("found usable device");
                                            var column = $('<tr>');
                                            column.append($('<td>').append('<button type="button" value='+BTdevice.address+'>'+BTdevice.name+" "+BTdevice.address+'</button>')); 
                                            table.append(column);
                                            break;
                                        }
                                    }
                                });

                                //ON BUTTON CLICK FUNCTION
                                $('#devicesTable table button').click(function (){
                                    stopScanning();
                                    createLoader();

                                    localStorage.setItem("connectedAddr", this.value);
                                    connectedAddr = this.value;
                                    bondSuccess = function(d){
                                        if(d.status == "bonding"){
                                            console.log("bonding");
                                        }
                                        else if(d.status == "bonded"){
                                            console.log("bonded");
                                            $('#myLoader').empty();
                                            alert("Address set\nNow you can download and explore data from your external device in CONNECTED DEVICE section");
                                        }
                                        else{
                                            console.log(d.status);
                                        }
                                    };
                                    bondError = function(er){
                                        if(er.error == "bond"){
                                            $('#myLoader').empty();
                                            alert("Address set\nNow you can download and explore data from your external device in CONNECTED DEVICE section");
                                        }
                                        else{
                                            console.log(er);
                                        }
                                    };
                                    bluetoothle.bond(bondSuccess, bondError, {address: connectedAddr});
                                });
                                bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: data.address});
                            }, discoverErrorCallback, param);
                        }, function(error){
                            console.log(JSON.stringify(error));
                            bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: error.address});
                            //alert(JSON.stringify(error));
                        }, param);
                        devices.push(BTdevice);
                    }
                }
            }

            //APPEND CREATED TABLE OF DEVICES TO DIV
            $(function (){
                $('#devicesTable').append(table);
            }); 

            //INITIALIZE
            if(data.status == "disabled"){
                alert("Please turn on Bluetooth on your device");
                $('#myLoader').empty();
                return;
            }
            else{
                 bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback);
            }
        }

        var startScanErrorCallback = function(error){
            console.log("scan"+JSON.stringify(error));
        }
        var initializeErrorCallback = function(error){
            console.log("init"+error.message);
        }
        var connectErrorCallback = function(error){
            if(error.error == "connect"){
                bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: error.address});
                bluetoothle.close(closeSuccessCallback, closeErrorCallback, {address: error.address});
            }
            else{
                console.log(JSON.stringify(error));
            }
        }
        var discoverErrorCallback = function(error){
            console.log(JSON.stringify(error));
            bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: error.address});
        }
        var disconnectSuccessCallback = function(data){
            console.log("disconnecting");
            var pDownloading = document.getElementById("pDownloading");
            if(pDownloading){
                pDownloading.innerHTML = "something went wrong try to refresh";
            }
            bluetoothle.close(closeSuccessCallback, closeErrorCallback, {address: data.address});
            connectedAddr = null;
            //alert("disconnect"+JSON.stringify(data));
        }
        var disconnectErrorCallback = function(error){
            console.log(JSON.stringify(error));
            bluetoothle.close(closeSuccessCallback, closeErrorCallback, {address: error.address});
        }
        var closeSuccessCallback = function(data){
            console.log("closed");
        }
        var closeErrorCallback = function(error){
            //alert("3"+JSON.stringify(error));
        }

        
        //alert(loadD + " " + loadF + " " + loadM + "D F M");
        var stopScanSuccessCallback = function(data){
            console.log("stopScan");
        }
        var stopScanErrorCallback = function(error){
            //console.log(JSON.stringify(error));
        }
        function onBackKeyDown() {
            stopScanning();
            //window.location.href="index.html";
        }
        
        $('#scanButton').on('click',function(){
            stopScanning();
            setTimeout(function(){
                loadD();
            },1000);
        });
        
        function loadD(){
            document.addEventListener("backbutton", onBackKeyDown, false);
            $("a").on('click', function() {
                if(this.id != "hrefDevices" && this.id != "scanButton"){
                    stopScanning();
                }
            });
            //START OF INITIALIZATION BT AND LOADING ANIMATION
            createLoader();
            bluetoothle.initialize(initializeSuccessCallback, initializeErrorCallback, {request: true});
        }
        
        
        
        
        function createGraphsFromFile()
        {
            $('.charts').empty();
            readFile('deviceData.txt');
            setTimeout(function(){
                if(dataObject){ 
                    var dateNow = new Date();
                    var hour = 1000*60*60;
                    var day = hour*24;
                    var month = day*30;
                    var obj = dataObject;
                    var lengthAr = obj.minute.length;
                    //Data for all time
                    //var allDataHR = [];
                    if(lengthAr > 0){
                        var allDataActivity = [];
                        var allDataSteps = [];
                        var helpTime = obj.minute[0].time;
                        var stepsPerHour = 0;
                        var d = new Date(helpTime);
                        d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours());
                        var helpHour = d.getTime();
                        var walkingCounter = 0, runningCounter = 0, chargingCounter = 0, sleepingCounter = 0, standingCounter = 0, sittingCounter = 0;
                        for(var c = 0; c < obj.minute.length; c++){
                            //Heart rate
                            /*let helpHr;
                            if(obj.minute[c].hr == 0 || obj.minute[c].hr == 255){
                                helpHr = 0;
                            }
                            else{
                                helpHr = obj.minute[c].hr;
                            }
                            allDataHR.push([obj.minute[c].time,helpHr]);*/

                            //Activity
                            if(obj.minute[c].activity == 1 || obj.minute[c].activity == 17 || obj.minute[c].activity == 33 || obj.minute[c].activity == 49 || obj.minute[c].activity == 81 || obj.minute[c].activity == 16){
                                //WALKING
                                walkingCounter++;
                            }
                            else if(obj.minute[c].activity == 18 || obj.minute[c].activity == 34 || obj.minute[c].activity == 50 || obj.minute[c].activity == 66 || obj.minute[c].activity == 82 || obj.minute[c].activity == 98){
                                //RUNNING
                                runningCounter++;
                            }
                            else if(obj.minute[c].activity == 6){
                                //CHARGING DEVICE
                                chargingCounter++;
                            }
                            else if(obj.minute[c].activity == 96 || obj.minute[c].activity == 106 || obj.minute[c].activity == 0 || obj.minute[c].activity == 105){
                                //STANDING
                                standingCounter++;
                            }
                            else if(obj.minute[c].activity == 28 || obj.minute[c].activity == 80 || obj.minute[c].activity == 90 || obj.minute[c].activity == 91 || obj.minute[c].activity == 92 || obj.minute[c].activity == 89){
                                //SITTING
                                sittingCounter++;
                            }
                            else if(obj.minute[c].activity >> 4 == 7 || obj.minute[c].activity == 83 || obj.minute[c].activity == 99 || obj.minute[c].activity == 115){
                                //SLEEPING
                                sleepingCounter++;
                            }
                            else{
                                //UNDEFINED
                                let upperNibble = obj.minute[c].activity >> 4;
                                let lowerNibble = obj.minute[c].activity & 15;
                                if(upperNibble >= 0 && upperNibble <= 4){
                                    //walk or run
                                    if(lowerNibble < 4){
                                        if(lowerNibble == 0){
                                            standingCounter++;
                                        }
                                        else if(lowerNibble == 1){
                                            walkingCounter++;
                                        }
                                        else if(lowerNibble == 2){
                                            runningCounter++;
                                        }
                                        else{
                                            sleepingCounter++;
                                        }
                                    }
                                    else{
                                        chargingCounter++;
                                    }
                                }
                                else if(upperNibble == 5){
                                    //sitting
                                    sittingCounter++;
                                }
                                else if(upperNibble == 6){
                                    //standing
                                    standingCounter++;
                                }
                            }

                            //Steps (per hour)
                            if(obj.minute[c].time < (helpTime + hour)){
                                stepsPerHour += obj.minute[c].steps;
                            }
                            else{
                                allDataSteps.push([helpHour,stepsPerHour]);
                                helpTime = obj.minute[c].time;
                                d = new Date(helpTime);
                                d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours());
                                helpHour = d.getTime();
                                stepsPerHour = obj.minute[c].steps;
                            }
                        }
                        createGraph(allDataSteps,'chart','Steps in time','Steps');
                        //createGraph(allDataHR,'chart1','Heart rate in time','Heart rate');
                        allDataActivity.push(["WALKING",walkingCounter]);
                        allDataActivity.push(["RUNNING",runningCounter]);
                        allDataActivity.push(["CHARGING",chargingCounter]);
                        allDataActivity.push(["SLEEPING",sleepingCounter]);
                        allDataActivity.push(["STANDING",standingCounter]);
                        allDataActivity.push(["SITTING",sittingCounter]);
                        createPieChart2(allDataActivity,'chart2');

                        //Data in last 24h
                        /*if(obj.minute[lengthAr-1].time > (dateNow.getTime() - day)){ //we do have some data in last 24h
                            var i = lengthAr-1;
                            while(obj.minute[i].time > (dateNow.getTime() - day)){
                                dataDayArray.push(obj.minute[i]);
                                i--;
                            }
                            stepsPerHour = 0;
                            var heartRateHour = [];
                            var timeNow = dateNow.getTime();
                            var j1 = 0;
                            console.log(dataDayArray);
                            for(var j=0;j<dataDayArray.length;j++){
                                if(dataDayArray[j].time > timeNow - hour){
                                    stepsPerHour += dataDayArray[j].steps;
                                    if(dataDayArray[j].hr != 0 && dataDayArray[j].hr != 255){
                                        heartRateHour.push(dataDayArray[j].hr);
                                    }
                                }
                                else{
                                    dataDaySteps[j1] = stepsPerHour;
                                    if(heartRateHour.length > 0){
                                        var helpHR = 0;
                                        for(var j2 = 0; j2<heartRateHour.length; j2++){
                                            helpHR += heartRateHour[j2];
                                        }
                                        dataDayHR[j1] = helpHR / heartRateHour.length;
                                    }
                                    else{
                                        dataDayHR[j1] = 0;
                                    }
                                    j1++;
                                    timeNow -= hour;
                                    stepsPerHour = dataDayArray[j].steps;
                                    heartRateHour = [];
                                }
                            }
                            dataDaySteps.reverse();
                            dataDayHR.reverse();
                            createBarChart(dataDaySteps,"chart");
                            createBarChart(dataDayHR,"chart1");
                        }*/
                        var dataDayArray = [];
                        var dataDaySteps = [];
                        //var dataDayHR = [];
                        var dataDayActivity = [];
                        console.log("Newest time "+obj.minute[lengthAr-1].time);
                        if(obj.minute[lengthAr-1].time > (dateNow.getTime() - day)){ //we do have some data in last 24h
                            var i = lengthAr-1;
                            while(obj.minute[i].time > (dateNow.getTime() - day)){
                                dataDayArray.push(obj.minute[i]);
                                i--;
                            }
                            dataDayArray.reverse();

                            helpTime = dataDayArray[0].time;
                            stepsPerHour = 0;
                            d = new Date(helpTime);
                            d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours());
                            var helpHour = d.getTime();
                            walkingCounter = 0, runningCounter = 0, chargingCounter = 0, sleepingCounter = 0, standingCounter = 0, sittingCounter = 0;
                            for(var j=0;j<dataDayArray.length;j++){
                                //Heart rate
                                /*let helpHr;
                                if(dataDayArray[j].hr == 0 || dataDayArray[j].hr == 255){
                                    helpHr = 0;
                                }
                                else{
                                    helpHr = dataDayArray[j].hr;
                                }
                                dataDayHR.push([dataDayArray[j].time,helpHr]);*/

                                //Activity
                                if(dataDayArray[j].activity == 1 || dataDayArray[j].activity == 17 || dataDayArray[j].activity == 33 || dataDayArray[j].activity == 49 || dataDayArray[j].activity == 81 || dataDayArray[j].activity == 16){
                                    //WALKING
                                    walkingCounter++;
                                }
                                else if(dataDayArray[j].activity == 18 || dataDayArray[j].activity == 34 || dataDayArray[j].activity == 50 || dataDayArray[j].activity == 66 || dataDayArray[j].activity == 82 || dataDayArray[j].activity == 98){
                                    //RUNNING
                                    runningCounter++;
                                }
                                else if(dataDayArray[j].activity == 6){
                                    //CHARGING DEVICE
                                    chargingCounter++;
                                }
                                else if(dataDayArray[j].activity == 96 || dataDayArray[j].activity == 106 || dataDayArray[j].activity == 0 || dataDayArray[j].activity == 105){
                                    //STANDING
                                    standingCounter++;
                                }
                                else if(dataDayArray[j].activity == 28 || dataDayArray[j].activity == 80 || dataDayArray[j].activity == 90 || dataDayArray[j].activity == 91 || dataDayArray[j].activity == 92 || dataDayArray[j].activity == 89){
                                    //SITTING
                                    sittingCounter++;
                                }
                                else if(dataDayArray[j].activity >> 4 == 7 || dataDayArray[j].activity == 83 || dataDayArray[j].activity == 99 || dataDayArray[j].activity == 115){
                                    //SLEEPING
                                    sleepingCounter++;
                                }
                                else{
                                    //UNDEFINED
                                    let upperNibble = dataDayArray[j].activity >> 4;
                                    let lowerNibble = dataDayArray[j].activity & 15;
                                    if(upperNibble >= 0 && upperNibble <= 4){
                                        //walk or run
                                        if(lowerNibble < 4){
                                            if(lowerNibble == 0){
                                                standingCounter++;
                                            }
                                            else if(lowerNibble == 1){
                                                walkingCounter++;
                                            }
                                            else if(lowerNibble == 2){
                                                runningCounter++;
                                            }
                                            else{
                                                sleepingCounter++;
                                            }
                                        }
                                        else{
                                            chargingCounter++;
                                        }
                                    }
                                    else if(upperNibble == 5){
                                        //sitting
                                        sittingCounter++;
                                    }
                                    else if(upperNibble == 6){
                                        //standing
                                        standingCounter++;
                                    }
                                }

                                //Steps (per hour)
                                if(dataDayArray[j].time < helpTime + hour){
                                    stepsPerHour += dataDayArray[j].steps;
                                }
                                else{
                                    dataDaySteps.push([helpHour,stepsPerHour]);
                                    helpTime = dataDayArray[j].time;
                                    d = new Date(helpTime);
                                    d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours());
                                    helpHour = d.getTime();
                                    stepsPerHour = dataDayArray[j].steps;
                                }
                            }
                            createGraph(dataDaySteps,'chart3','Steps in 24h','Steps');
                            //createGraph(dataDayHR,'chart4','Heart rate in 24h','Heart rate');
                            dataDayActivity.push(["WALKING",walkingCounter]);
                            dataDayActivity.push(["RUNNING",runningCounter]);
                            dataDayActivity.push(["CHARGING",chargingCounter]);
                            dataDayActivity.push(["SLEEPING",sleepingCounter]);
                            dataDayActivity.push(["STANDING",standingCounter]);
                            dataDayActivity.push(["SITTING",sittingCounter]);
                            createPieChart2(dataDayActivity,'chart5');
                        }
                    }
                }
                else{
                    dataObject = {minute:[]};
                }
                $('#myLoader').empty();
            },3000);
        }
        
        $('#downloadButton').on('click',function(){
            loadB();
        });
        function loadB(){
            console.log("Downloading data and creating graphs");
            var pError = document.getElementById("pError");
            if(pError){
                pError.parentNode.removeChild(pError);
            }
            createLoader();
            var firstDataArrived = true;
            var writeToFile = true;
            createGraphsFromFile();
            
            connectedAddr = localStorage.getItem("connectedAddr");
            if(connectedAddr != null){
                function onBackKeyDownB(){
                    bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: connectedAddr});
                    bluetoothle.close(closeSuccessCallback, closeErrorCallback, {address: connectedAddr});
                }
                document.addEventListener("backbutton", onBackKeyDownB, false);
                $(".dropdownA").on('click', function() {
                    onBackKeyDownB();
                });
                var timeSent; 
                var dataArray = [];
                var controlSubscribe = true;
                
                var writeSuccess = function(dat){
                    console.log("sucWrite");
                    //console.log(bluetoothle.encodedStringToBytes(dat.value));
                }
                var writeError = function(err){
                    console.log("errWrite");
                    console.log(err);
                }
                var subscribeSuccessActivity = function(data){
                    if(data.status == "subscribed"){
                        console.log("subscribed activity data");
                    }
                    else if(data.status == "subscribedResult"){
                        console.log("subscribeResultActivity");
                        console.log(bluetoothle.encodedStringToBytes(data.value));
                        var actData = bluetoothle.encodedStringToBytes(data.value);
                        
                        var activity;
                        var steps;
                        var heartRate;
                        var minData = new Uint8Array(4);
                        for(j = 0; j < 4; j++){
                            for(i = 0; i < 4; i++){
                                minData[i] = actData[(i+1)+(j*4)];
                            }
                            timeSent += 60000; //1 minute
                            activity = minData[0];
                            steps = minData[2];
                            heartRate = minData[3];
                            dataArray.push({time:timeSent,activity:activity,steps:steps,hr:heartRate});
                        }
                        console.log(timeSent);
                    }
                    else{
                        console.log("Something went wrong" + data.status);
                    }
                }
                var subscribeSuccessFetch = function(data){
                    if(data.status == "subscribed"){
                        console.log("subscribed fetch");
                    }
                    else if(data.status == "subscribedResult"){
                        console.log("subscribeResultFetch");
                        console.log(bluetoothle.encodedStringToBytes(data.value));
                        var gettedData = bluetoothle.encodedStringToBytes(data.value);
                        if(gettedData[0] == 16 && gettedData[1] == 1 && gettedData[2] == 1){
                            let num1 = gettedData[3]; //4-7 number of bytes/packets to expect
                            let num2 = gettedData[4];
                            let num3 = gettedData[5];
                            let num4 = gettedData[6]; 
                            let year = gettedData[7]+(gettedData[8]*16*16);
                            let month = gettedData[9];
                            let day = gettedData[10];
                            let hour = gettedData[11];
                            let minute = gettedData[12];
                            let second = gettedData[13];
                            let tz = gettedData[14];
                            let d = new Date(year,(month - 1),day,hour,minute,second);
                            timeSent = d.getTime();
                            console.log(timeSent);
                            if(num1 + num2 + num3 + num4 > 0){
                                var data = new Uint8Array(1);  
                                data[0] = 0x02;
                                var encodedString = bluetoothle.bytesToEncodedString(data);
                                let params = {
                                    address: connectedAddr,
                                    service: "FEE0",
                                    characteristic: "00000004-0000-3512-2118-0009af100700", //[WriteWithoutResponse", "Notify"]} UUID_CHAR_FETCH
                                    value: encodedString,
                                    type: "noResponse"
                                }
                                if(controlSubscribe){
                                    controlSubscribe = false;
                                    let par = {
                                        address: connectedAddr,
                                        service: "FEE0",
                                        characteristic: "00000005-0000-3512-2118-0009af100700" //UUID_CHAR_FETCH
                                    }
                                    bluetoothle.subscribe(subscribeSuccessActivity, subscribeError, par);
                                }
                                setTimeout(function(){bluetoothle.write(writeSuccess, writeError, params);},1000);
                            }
                            else{
                                if(firstDataArrived){
                                    writeToFile = false;
                                }
                                let par = {
                                    address: connectedAddr,
                                    service: "FEE0",
                                    characteristic: "00000004-0000-3512-2118-0009af100700", //[WriteWithoutResponse", "Notify"]} UUID_CHAR_FETCH
                                    value: "",
                                    type: "noResponse"
                                }
                                var data = new Uint8Array(1);  
                                data[0] = 0x03;
                                var encodedString = bluetoothle.bytesToEncodedString(data);
                                par.value = encodedString;
                                bluetoothle.write(writeSuccess, writeError, par);
                            }
                            firstDataArrived = false;
                        }
                        else if(gettedData[0] == 16 && gettedData[1] == 2 && gettedData[2] == 1){
                            console.log("end OK");
                            let now = new Date();
                            now = now.getTime();
                            if(timeSent <= now - 100000){
                                console.log("sending another " + timeSent + " " + now);
                                data = new Uint8Array(10);  
                                data[0] = 0x01; data[1] = 0x01;
                                if(lastTimeSent == timeSent){
                                    timeSent += 1000 * 60 * 60; //+ 1hour
                                }
                                d = new Date(timeSent); //last date
                                let yr= d.getFullYear();
                                data[2] = yr & 0xff;
                                data[3] = yr >> 8;
                                data[4] = d.getMonth() + 1; 
                                data[5] = d.getDate(); data[6] = d.getHours(); data[7] = d.getMinutes(); data[8] = d.getSeconds();
                                data[9] = /*Math.floor(*/-(d.getTimezoneOffset()/15);
                                lastTimeSent = timeSent;
                                timeSent = timeSent - 60000;
                                encodedString = bluetoothle.bytesToEncodedString(data);
                                let params = {
                                    address: connectedAddr,
                                    service: "FEE0",
                                    characteristic: "00000004-0000-3512-2118-0009af100700", //[WriteWithoutResponse", "Notify"]} UUID_CHAR_FETCH
                                    value: encodedString,
                                    type: "noResponse"
                                }
                                bluetoothle.write(function(da){
                                    console.log("writeSucFetch"); 
                                }, writeError, params);
                            }
                            else{
                                console.log("end");
                                writeToFile = true;
                                let params = {
                                    address: connectedAddr,
                                    service: "FEE0",
                                    characteristic: "00000004-0000-3512-2118-0009af100700", //[WriteWithoutResponse", "Notify"]} UUID_CHAR_FETCH
                                    value: "",
                                    type: "noResponse"
                                }
                                var data = new Uint8Array(1);  
                                data[0] = 0x03;
                                var encodedString = bluetoothle.bytesToEncodedString(data);
                                params.value = encodedString;
                                bluetoothle.write(writeSuccess, writeError, params);
                            }
                        }
                        else if(gettedData[0] == 16 && gettedData[1] == 3 && gettedData[2] == 1){
                            var pDownloading = document.getElementById("pDownloading");
                            if(pDownloading){
                                pDownloading.parentNode.removeChild(pDownloading);
                            }
                            console.log("EOT");
                            //console.log(JSON.stringify(dataObject));
                            console.log(writeToFile);
                            if(writeToFile){
                                localStorage.setItem("notificationTime",timeSent);
                                createFile('deviceData.txt');
                                for(let i = 0; i < dataArray.length; i++){
                                    dataObject.minute.push(dataArray[i]);
                                }
                                setTimeout(function(){writeFile('deviceData.txt',dataObject);},1000);
                            }
                            //setTimeout(function(){readFile('deviceData.txt');},5000);
                            //setTimeout(function(){removeFile('deviceData.txt');},6000);
                        }
                    }
                    else{
                        console.log("Something went wrong" + data.status);
                    }
                }
                var subscribeError = function(error){
                    //alert("subscribe"+JSON.stringify(error));
                }
                
                function authFunction(){
                    var params = {
                        address: connectedAddr,
                        service: "FEE1",
                        characteristic: "00000009-0000-3512-2118-0009af100700", //["Read", "WriteWithoutResponse", "Notify"]} UUID_CHARACTERISTIC_AUTH
                        value: "",
                        type: "noResponse"
                    }
                    var authStorage = localStorage.getItem("authentification");
                    
                    var subSuc = function(d){
                        if(d.status == "subscribed"){
                            console.log("auth subscribed");
                        }
                        else if(d.status == "subscribedResult"){
                            console.log("auth subsc result");
                            let gettedData = bluetoothle.encodedStringToBytes(d.value);
                            
                            if(gettedData[0] == 16 && gettedData[1] == 1 && gettedData[2] == 1){
                                console.log("Requesting a random authentication key");
                                localStorage.setItem("authentification", params.value);
                                let dat = new Uint8Array(2);
                                dat[0] = 0x02;  dat[1] = 0x08; 
                                let encodedString = bluetoothle.bytesToEncodedString(dat);
                                params.value = encodedString;
                                bluetoothle.write(writeSuccess, writeError, params);
                            }
                            else if(gettedData[0] == 16 && gettedData[1] == 2 && gettedData[2] == 1){
                                console.log("Sending the encrypted random authentication key");
                                text = gettedData.slice(3);
                                var data = app.encrypt(text);
                                let encodedString = bluetoothle.bytesToEncodedString(data);
                                params.value = encodedString;
                                bluetoothle.write(writeSuccess, writeError, params);
                            }
                            else if(gettedData[0] == 16 && gettedData[1] == 3 && gettedData[2] == 1){
                                console.log("Auth done");
                                readFunctionAuthorized();
                            }
                            else if(gettedData[0] == 16 && gettedData[1] == 3 && gettedData[2] == 4){
                                console.log("Auth failed");
                            }
                            else{
                                console.log("Something went wrong" + gettedData);
                            }
                        }
                        else{
                            console.log("Something went wrong" + d.status);
                        }
                    };
                    var subErr = function(e){
                        console.log(e);
                    };
                    bluetoothle.subscribe(subSuc, subErr, {address: connectedAddr,
                                                            service: "FEE1",
                                                            characteristic: "00000009-0000-3512-2118-0009af100700"});
                    
                    //AUTHENTIFICATION
                    if(authStorage == null){
                        let data = new Uint8Array(18);  
                        data[0] = 0x01;  data[1] = 0x08;  data[2] = 0x30;  data[3] = 0x31;  data[4] = 0x32;  data[5] = 0x33;  data[6] = 0x34;
                        data[7] = 0x35;  data[8] = 0x36;  data[9] = 0x37;  data[10] = 0x38;  data[11] = 0x39;  data[12] = 0x40;
                        data[13] = 0x41;  data[14] = 0x42;  data[15] = 0x43;  data[16] = 0x44;  data[17] = 0x45;
                        let encodedString = bluetoothle.bytesToEncodedString(data);
                        params.value = encodedString;
                        bluetoothle.write(writeSuccess, writeError, params);
                    }
                    else{
                        let dat = new Uint8Array(2);
                        dat[0] = 0x02;  dat[1] = 0x08; 
                        let encodedString = bluetoothle.bytesToEncodedString(dat);
                        params.value = encodedString;
                        bluetoothle.write(writeSuccess, writeError, params);
                    }
                }; 
                
                function readFunctionUnauthorized(){
                    var readError = function(error){
                        console.log("readUnauthorized"+JSON.stringify(error));
                        var pDownloading = document.getElementById("pDownloading");
                        if(pDownloading){
                            pDownloading.innerHTML = "something went wrong try to refresh";
                        }
                    }
                    var params = {
                        address: connectedAddr,
                        service: "FEE0",
                        characteristic: "00000006-0000-3512-2118-0009af100700" //BATTERY INFO, notify read
                    }
                    //read battery info
                    bluetoothle.read(function(data){
                        var batD = bluetoothle.encodedStringToBytes(data.value);
                        let level = batD[0];
                        let chargePercentage = batD[1];
                        let status = batD[2];
                        let statusString;
                        if(status == 0){
                            statusString = "normal";
                        }
                        else{
                            statusString = "charging";
                        }
                        let year = batD[3]+(batD[4]*16*16);
                        let month = batD[5];
                        let day = batD[6];
                        let hour = batD[7];
                        let minute = batD[8];
                        let second = batD[9];
                        let numOfCharges = batD[10];
                        //last charge time (LCT)
                        let LCTy = batD[11]+(batD[12]*16*16);
                        let LCTm = batD[13];
                        let LCTd = batD[14];
                        let LCTh = batD[15];
                        let LCTmin = batD[16];
                        let LCTs = batD[17];
                        let LCTnumOfChar = batD[18];
                        let wasCharged = batD[19]; //how much was charged last time

                        var batteryDiv = document.getElementById("batteryInfo");
                        batteryDiv.innerHTML = "";
                        /*var par = document.createElement("p");
                        var text = document.createTextNode("Level: " + level);
                        par.appendChild(text);
                        batteryDiv.appendChild(par);*/

                        var par = document.createElement("p");
                        var text = document.createTextNode("Charged: " + chargePercentage + "%");
                        par.appendChild(text);
                        batteryDiv.appendChild(par);

                        par = document.createElement("p");
                        text = document.createTextNode("Status: " + statusString);
                        par.appendChild(text);
                        batteryDiv.appendChild(par);

                        /*par = document.createElement("p");
                        text = document.createTextNode("Last charge start: " +day+"/"+month+"/"+year+" "+hour+":"+minute+":"+second);
                        par.appendChild(text);
                        batteryDiv.appendChild(par);*/

                        par = document.createElement("p");
                        text = document.createTextNode("Last charged: " +LCTd+"/"+LCTm+"/"+LCTy+" "+LCTh+":"+LCTmin+":"+LCTs+" to "+wasCharged+"%");
                        par.appendChild(text);
                        batteryDiv.appendChild(par);

                        /*par = document.createElement("p");
                        text = document.createTextNode("Was charged: " + wasCharged + "%");
                        par.appendChild(text);
                        batteryDiv.appendChild(par);*/
                    }, readError, params);
                };
                
                function readFunctionAuthorized(){
                    var readError = function(error){
                        console.log("readAuthorized"+JSON.stringify(error));
                        var pDownloading = document.getElementById("pDownloading");
                        if(pDownloading){
                            pDownloading.innerHTML = "something went wrong try to refresh";
                        }
                    }
                    var params = {
                        address: connectedAddr,
                        service: "FEE0",
                        characteristic: "00000007-0000-3512-2118-0009af100700" //REALTIME STEPS, notify read
                    }
                    
                    //read realtime steps
                    bluetoothle.read(function(data){
                        var batD = bluetoothle.encodedStringToBytes(data.value);
                        console.log(batD);
                                       
                        let numOfSteps = batD[1];
                        let numOfSteps1 = 256 * batD[2];
                        let numOfSteps2 = 65536 * batD[3];
                        let ns = numOfSteps + numOfSteps1 + numOfSteps2;
                        
                        var stepsDiv = document.getElementById("stepsInfo");
                        stepsDiv.innerHTML = "";
                        var par = document.createElement("p");
                        var text = document.createTextNode("Steps today: " + ns);
                        par.appendChild(text);
                        stepsDiv.appendChild(par);
                    }, readError, params);
                    
                    //WRITE TO FETCH CHARACTERISTIC TO GET NOTIFICATIONS FROM ACTIVITY DATA
                    params = {
                        address: connectedAddr,
                        service: "FEE0",
                        characteristic: "00000004-0000-3512-2118-0009af100700", //[WriteWithoutResponse", "Notify"]} UUID_CHAR_FETCH
                        value: "",
                        type: "noResponse"
                    }
                    var data = new Uint8Array(10);  
                    data[0] = 0x01; data[1] = 0x01;
                    var storageTime = parseInt(localStorage.getItem("notificationTime"));
                    if(storageTime){
                        let d = new Date(storageTime); //last_date !!
                        let yr = d.getFullYear();
                        data[2] = yr & 0xff;
                        data[3] = yr >> 8;
                        data[4] = d.getMonth() + 1;
                        data[5] = d.getDate();
                        data[6] = d.getHours();
                        data[7] = d.getMinutes();
                        data[8] = d.getSeconds();
                        data[9] = Math.floor(-(d.getTimezoneOffset()/15));
                        timeSent = d.getTime() - 60000;
                    }
                    else{
                        let d = new Date();
                        let dHelp = d.getTime() - (1000*60*30*24*30) - 60000; //1 month ago
                        d = new Date(dHelp);
                        /*data[2] = 0xe3; data[3] = 0x07; data[4] = 0x01; data[5] = 0x01;
                        data[6] = 0x0; data[7] = 0x0; data[8] = 0x0; data[9] = -(d.getTimezoneOffset()/15);*/
                        let yr= d.getFullYear();
                        data[2] = yr & 0xff;
                        data[3] = yr >> 8;
                        data[4] = d.getMonth() + 1;
                        data[5] = d.getDate();
                        data[6] = d.getHours();
                        data[7] = d.getMinutes();
                        data[8] = d.getSeconds();
                        data[9] = Math.floor(-(d.getTimezoneOffset()/15));
                        timeSent = d.getTime() - 60000;
                    }
                    
                    var encodedString = bluetoothle.bytesToEncodedString(data);
                    params.value = encodedString;
                    
                    var par = {
                        address: connectedAddr,
                        service: "FEE0",
                        characteristic: "00000004-0000-3512-2118-0009AF100700" //UUID_CHAR_FETCH
                    }
                    bluetoothle.subscribe(subscribeSuccessFetch, subscribeError, par);
                    
                    bluetoothle.write(function(da){
                        console.log("writeSucFetch");
                    }, writeError, params);
                     
                }
                
                connectError = function(er){
                    if(er.error == "connect"){
                        bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: er.address});
                        bluetoothle.close(closeSuccessCallback, closeErrorCallback, {address: er.address});
                    }
                    else{
                        var pDownloading = document.getElementById("pDownloading");
                        if(pDownloading){
                            pDownloading.innerHTML = "something went wrong try to refresh";
                        }
                        var batteryDiv = document.getElementById("deviceHeader");
                        var par = document.createElement("p");
                        par.setAttribute("id", "conError");
                        var text = document.createTextNode("Cannot connect to device or not found");
                        console.log(JSON.stringify(er));
                        par.appendChild(text);
                        batteryDiv.appendChild(par);
                    }
                };              
                setTimeout(function(){
                    bluetoothle.initialize(function(data){
                        if(data.status == "disabled"){
                            alert("Please turn on Bluetooth on your device");
                            return;
                        }
                        else{
                            bluetoothle.connect(function(data){
                                var batteryDiv = document.getElementById("deviceHeader");
                                var pDownloading = document.getElementById("pDownloading");
                                if(pDownloading){
                                    pDownloading.parentNode.removeChild(pDownloading);
                                }
                                var par = document.createElement("p");
                                par.setAttribute("id","pDownloading");
                                par.innerHTML = "Downloading data, it may take a while ..."+"<br />" +"(Tap on device, if it asks)";
                                batteryDiv.appendChild(par);
                                bluetoothle.discover(function(data){   
                                    //subscribeFunction();
                                    authFunction();
                                    readFunctionUnauthorized();

                                    /*setTimeout(function(){
                                        bluetoothle.disconnect(disconnectSuccessCallback, disconnectErrorCallback, {address: connectedAddr});
                                    },10000);*/
                                },discoverErrorCallback,{address: connectedAddr});
                            }, connectError, {address: connectedAddr});
                        }
                    }, initializeErrorCallback, {request: true,
                                                 statusReceiver: true,
                                                 restoreKey: "rockieStepcounter"});
                },2000);
            }
            else{
                var batteryDiv = document.getElementById("deviceHeader");
                var par = document.createElement("p");
                par.setAttribute("id","pError");
                var text = document.createTextNode("No device connected");
                par.appendChild(text);
                batteryDiv.appendChild(par);
            }
        }

        
        
        
        
        
        
        //PEDOMETER FROM GOOGLE FIT
        /*var googleFIT = function(){
            var successHandlerSteps = function(data) {
                var quest = 5000; //5000 steps per day
                var width = (data[data.length-1].value / quest)*100;
                if(width >= 100)
                    width = 100;
                var progressBar = document.getElementById("progressBar");
                var stepsCount = document.getElementById("stepsCount");
                progressBar.style.width = parseFloat((width).toFixed(2)) + '%'; 
                progressBar.innerHTML = parseFloat((width).toFixed(2))  + '%';
                stepsCount.innerHTML = data[data.length-1].value;

                $('#daysTable').empty();
                function createTable (){
                    var table = $('<table>');
                    for(var i = 0; i < data.length;i++)
                    {
                        try{throw i}
                        catch(ii) {
                        var column = $('<tr>');
                        column.append($('<td>').append('<button type="button" value='+data[ii].value+'>'+data[i].startDate.getDate()+"."+(data[i].startDate.getMonth() + 1)+"."+data[i].startDate.getFullYear()+'</button>')); 
                        column.data("steps", data[i].value);
                        table.append(column);
                        }
                    }
                    return table;
                }
                $(function (){
                    $('#daysTable').append(createTable());
                    $('#daysTable table button').click(function (){
                        var stepsCount = document.getElementById("test");
                        $("#test").html($(this).parent().parent().data('steps'));
                    })
                });

            };
            var successHandlerCalories = function(data) {
                var caloriesCount = document.getElementById("caloriesCount");
                caloriesCount.innerHTML = parseFloat((data[data.length-1].value).toFixed(2)) + "" + data[data.length-1].unit;
            };
            var successHandlerDistance = function(data) {
                var distanceCount = document.getElementById("distanceCount");
                distanceCount.innerHTML = parseFloat((data[data.length-1].value).toFixed(2)) + "" + data[data.length-1].unit;
            };
            var successHandlerHeight = function(data) {
                data.value = 100;
            };

            var successCallbackAv = function (av){
                var datatypes = [
                    'calories', 'distance',   // Read and write permissions
                    {
                        read : ['steps'],       // Read only permission
                        write : ['height', 'weight']  // Write only permission
                    }
                ];
                navigator.health.requestAuthorization(datatypes, successCallbackAuth, failureCallback2);
            };

            var successCallbackAuth = function (auth){
                navigator.health.query({
                    startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
                    endDate: new Date(), // now
                    dataType: 'height',
                    limit: 1000
                }, successHandlerHeight, failureCallback);
                navigator.health.queryAggregated({
                    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), // week ago
                    endDate: new Date(), // now
                    dataType: 'steps',
                    bucket: 'day'
                }, successHandlerSteps, failureCallback);
                navigator.health.queryAggregated({
                    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), // week ago
                    endDate: new Date(), // now
                    dataType: 'distance',
                    bucket: 'day'
                }, successHandlerDistance, failureCallback);
                navigator.health.queryAggregated({
                    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), // week ago
                    endDate: new Date(), // now
                    dataType: 'calories',
                    bucket: 'day'
                }, successHandlerCalories, failureCallback);
            };
            var failureCallback = function (err){
                console.log(err);
                setTimeout(navigator.health.isAvailable, 1000);
            };
            var failureCallback2 = function (err){
                console.log(err);
                setTimeout(navigator.health.requestAuthorization, 1000);
            };

            function loadHealthApi() {
                navigator.health.isAvailable(successCallbackAv, failureCallback);
            }
            loadHealthApi();
        }*/
        //googleFIT();
        
        
        
        
        
        
        
        
        
        
        //MAP
        $('#mapButton').on('click',function(){
            myMap.Clear();
            setTimeout(function(){
                lines.forEach(function(line) {
                    myMap.Add(line);
                });
            },300);
        });
        navigator.geolocation.getCurrentPosition(function(position){
            console.log("current accuracy: " + position.coords.accuracy);
            console.log("current position: " + position.coords.latitude+" "+ position.coords.longitude);
        }, onMapError, {enableHighAccuracy:true, maximumAge:Infinity, timeout:30000});
        function saveMapCoordsToLocalStorage(data)
        {
            var todayD = new Date();
            todayD = new Date(todayD.getFullYear(),todayD.getMonth(),todayD.getDate());
            var today = todayD.getTime();
            var a = JSON.parse(localStorage.getItem('mapCoords'));
            if(a){
                var pushed = false;
                for(var i = 0; i < a.length; i++){
                    if(a[i].day <= today - week){
                        a.shift();
                    }
                    else if(a[i].day == today){
                        pushed = true;
                        a[i].data.push(data);
                    }
                }
                if(!pushed){
                    a.push({day:today,data:[data]});
                }
                localStorage.setItem('mapCoords', JSON.stringify(a));
            }else{
                a = [{day:today,data:[data]}];
                localStorage.setItem('mapCoords', JSON.stringify(a));
            }
        }
        
        
        
        var errorCount = 0;
        function getMapLocation() {
            //console.log("getting location");
            navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, {enableHighAccuracy:true, maximumAge:Infinity, timeout:30000});
        }
        function onMapSuccess(position) {
            //console.log("setting first point on map");
            Latitude = position.coords.latitude;
            Longitude = position.coords.longitude;
            getMap(Latitude, Longitude);  
            getMap(Latitude, Longitude); 
        }
        function onMapError(error) {
            //alert(error.code + "\n" + error.message);
            $.notify("Trying to find your position \n It may take a while \n Restart app may also help");
            console.log(error);
            errorCount++;
            if(errorCount < 2){
                getMapLocation();
            }
            else{
                $.notify("Something went wrong\n Make sure you have had enabled access to your location for this app");
            }
        }
        function getMap(latitude, longitude) {
            //SAVE COORDINATES WITH TIME HERE
            //console.log("map position: "+latitude+" " +longitude);
            mapPosition = [longitude, latitude];
            myMap.Map.getView().setCenter(mapPosition);

            if(lineToPush.length == 0){
                //console.log("set 1st point(not painting on map yet)");
                lineToPush[0] = mapPosition;
            }
            else{
                //console.log("set 2nd point(painting on map)");
                lineToPush[1] = mapPosition;
                lines.push(lineToPush);
                myMap.Add(lineToPush);
                lineToPush = [];
                lineToPush[0] = mapPosition;
            }   
        }

        //navigator.geolocation.clearWatch(watchID); //Stop watching for changes to the device's location
        function loadMapsApi() {
            //console.log("maps API");
            if(!myMap){
                myMap = new Map("map", mapPosition, 16);
                
                var mapPositions;
                var todayD = new Date();
                todayD = new Date(todayD.getFullYear(),todayD.getMonth(),todayD.getDate());
                var today = todayD.getTime();
                var a = JSON.parse(localStorage.getItem('mapCoords'));
                if(a){
                    for(var i = 0 ; i < a.length; i++){
                        if(a[i].day == today){
                            mapPositions = a[i].data;
                        }
                    }
                    if(mapPositions){
                        for(var i = 0; i < mapPositions.length; i++){
                            console.log(i);
                            if(lineToPush.length == 0){
                                lineToPush[0] = mapPositions[i];
                            }
                            else{
                                lineToPush[1] = mapPositions[i];
                                lines.push(lineToPush);
                                myMap.Add(lineToPush);
                                lineToPush = [];
                                lineToPush[0] = mapPositions[i];
                            } 
                        }
                    }
                }
                getMapLocation();
            }
        }
        
        function loadM(){
            let conDev = checkConnection();
            if(conDev){
                loadMapsApi();
            }
            else{
                if(!myMap){
                    alert("Map can not be created without internet connection");
                }
            }
        }
        
        var onMapWatchSuccess = function (position) {
            //$.notify("position updated");
            let conDev = checkConnection();
            
            var controlDate = new Date();
            if(currentDay + 1000*60*60*24 < controlDate.getTime()){
                controlDate = new Date(controlDate.getFullYear(),controlDate.getMonth(),controlDate.getDate());
                currentDay = controlDate.getTime();
                app.initialize();
            }
            
            console.log(position);
            var updatedLatitude = position.coords.latitude;
            var updatedLongitude = position.coords.longitude;
            if(Latitude == null || Longitude == null){
                Latitude = updatedLatitude;
                Longitude = updatedLongitude;
            }
            console.log("difference: "+(Math.abs(updatedLatitude - Latitude) + Math.abs(updatedLongitude - Longitude))+" accuracy "+position.coords.accuracy);
            if(position.coords.accuracy <= 20){
                if((Math.abs(updatedLatitude - Latitude) + Math.abs(updatedLongitude - Longitude)) > 0.0004){ 
                    Latitude = updatedLatitude;
                    Longitude = updatedLongitude; 
                    console.log(Latitude + " " + Longitude);
                    var speed = position.coords.speed;
                    if(speed == null)
                        speed = 0;
                    var heading = position.coords.heading;
                    if(heading == null)
                        heading = 0;
                    saveMapCoordsToLocalStorage([Longitude, Latitude, speed.toFixed(2), heading.toFixed(2)]);
                    if(myMap && conDev){
                        getMap(updatedLatitude, updatedLongitude);
                    }
                }
            }
        }
        var watchID = navigator.geolocation.watchPosition(onMapWatchSuccess,onMapError,{maximumAge: 30000,timeout: 60000,enableHighAccuracy: true});
        
    }
};
app.initialize();







$('#chartA').on('click',function(){
    $('.charts').hide();
    $(this).css( 'font-weight', 'bold' );
    $(this).css( 'border', '2px solid black' );
    //$('#chartB').css( 'font-weight', 'normal' );
    $('#chartC').css( 'font-weight', 'normal' );
    $('#chartC').css( 'border', '1px solid black' );
    if(document.getElementById("radioMonths").checked){
        $('#chart').show();
    }
    else{
        $('#chart3').show();
    }
});
/*$('#chartB').on('click',function(){
    $('.charts').hide();
    $(this).css( 'font-weight', 'bold' );
    $('#chartA').css( 'font-weight', 'normal' );
    $('#chartC').css( 'font-weight', 'normal' );
    if(document.getElementById("radioMonths").checked){
        $('#chart1').show();
    }
    else{
        $('#chart4').show();
    }
});*/
$('#chartC').on('click',function(){
    $('.charts').hide();
    $(this).css( 'font-weight', 'bold' );
    $(this).css( 'border', '2px solid black' );
    //$('#chartB').css( 'font-weight', 'normal' );
    $('#chartA').css( 'font-weight', 'normal' );
    $('#chartA').css( 'border', '1px solid black' );
    if(document.getElementById("radioMonths").checked){
        $('#chart2').show();
    }
    else{
        $('#chart5').show();
    }
});
$('.radioB').on('click',function(){
    $('.charts').hide();
});
