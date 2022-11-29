// global variables
const yScale = d3.scaleLinear();
const xScale = d3.scaleLinear();
let data;
state_codes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
               'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
               'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
               'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
               'SD', 'TN', 'TX', 'UT', 'VT',' VA', 'WA', 'WV', 'WI', 'WY'];


var hurricaneDatas;
var currentHurricaneData;
var currentHurricaneDataIndex;
var leafletMap;
/*
    hurricane datasets:
    https://ibtracs.unca.edu/index.php?name=v04r00-1970138N12281
    https://ibtracs.unca.edu/index.php?name=v04r00-2021239N17281#idata
    https://ibtracs.unca.edu/index.php?name=v04r00-1985224N18279





*/


const datasets = [
            d3.csv("data/hurricanealma1970.csv"),
            d3.csv("data/hurricanedanny1985.csv"),
            d3.csv("data/hurricaneearl1998.csv"),
            d3.csv("data/hurricanejeanne2004.csv"),
            d3.csv("data/hurricanesally2020.csv"),
            d3.csv("data/hurricaneida2021.csv")
            ];

document.addEventListener('DOMContentLoaded', function () {
    Promise.all(datasets)
    .then(function (values) {
        //innovative visualization (hurricane path)

        hurricaneDatas = Array(6);

        for(var i = 0; i < 6; i++){
            tempHurricaneData = values[i];        // **** make sure d3.csv load order is correct!!!!! *****

            var prevWind = +tempHurricaneData[0]["WMO WIND"];
            tempHurricaneData.forEach((d) =>{
                d["LAT"] = +d["LAT"];
                d["LON"] = +d["LON"];
        
                if(d["WMO WIND"] === ""){
                    d["WMO WIND"] = prevWind;
                }else{
                    d["WMO WIND"] = +d["WMO WIND"];
                }
                
                prevWind = d["WMO WIND"];
                
            });

            hurricaneDatas[i] = tempHurricaneData;
        }
        
        currentHurricaneDataIndex = 0;

        leafletMap = L.map('leaflet-map',{zoomControl: false,minZoom: 5, maxZoom: 5}).setView([33.448, -80.074], 5);
        hurricaneMapPlot();
        

    });

});
function runScroll(){

    
}
function tempbutton(option){
    console.log(option);
    var incremval;
    if(option === "prev"){
        incremval = -1;
    }else{
        // "next"
        incremval = 1;
    }

    currentHurricaneDataIndex = (currentHurricaneDataIndex + incremval) % 6;

    hurricaneMapPlot();
}
function hurricaneMapPlot(){
    
    // Add a tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(leafletMap);

    currentHurricaneData = hurricaneDatas[currentHurricaneDataIndex];

    d3.select("#hurri-path-svg").remove();

    var svg = d3.select("#leaflet-map").append("svg")
                                            .attr("id","hurri-path-svg")
                                            .attr("class","graph");

    var svgBounds = L.latLngBounds(
        L.latLng(90,180),
        L.latLng(-90,-180)
    );


    // const allLat = hurricaneData.map(x => x["LAT"]);
    // const allLng = hurricaneData.map(x => x["LON"]);
    // var maxBounds = L.latLngBounds(L.latLng(d3.max(allLat) + 10,d3.max(allLng) + 10),L.latLng(d3.min(allLat) - 10,d3.min(allLng) - 10));
    // leafletMap.setMaxBounds(maxBounds);

    //L.rectangle(svgBounds).addTo(leafletMap);
    

    svg.select('g').remove();

    const g = svg.append('g');

    const radiusScale = d3.scaleLinear()
                                .domain([0,140])
                                .range([4,20]);
    const intensityScale = d3.scaleSequential(d3.interpolateTurbo)
                                .domain([0,140]);

    
    
    
    var lines = g.append("path")
                        .data([currentHurricaneData])
                        .style("stroke","black")
                        .style("stroke-width","10px")
                        .style("fill","none")
                        .attr("d",d3.line()
                                .x((d) => leafletMap.project(L.latLng(d["LAT"],d["LON"]))["x"])
                                .y((d) => leafletMap.project(L.latLng(d["LAT"],d["LON"]))["y"])
                                .curve(d3.curveCardinal)
                                );

    var circles = g.selectAll('circle')
                        .data(currentHurricaneData)
                        .enter()
                        .append('circle')      
                        .style('fill', d => intensityScale(d["WMO WIND"]))
                        .style("stroke","black")
                        .style("stroke-width","1px")
                        .attr('cx', d => leafletMap.project([d["LAT"],d["LON"]])["x"])
                        .attr('cy', d => leafletMap.project([d["LAT"],d["LON"]])["y"])
                        .transition()
                        .duration(1000)
                        .delay((d,i) => 100 * i)
                        .attr('r', d => radiusScale(d["WMO WIND"]));

    var linelen = lines.node().getTotalLength();

    lines.attr("stroke-dasharray", `${linelen} ${linelen}`)
        .attr("stroke-dashoffset", linelen)
        .transition()
        .duration(6000)
        .ease(d3.easeQuad)
        .attr("stroke-dashoffset", 0);

    var svgOverlay = L.svgOverlay(document.querySelector("#hurri-path-svg"), svgBounds, {
        opacity: 0.9,
        interactive: true
    }).addTo(leafletMap);

    //leafletMap.addEventListener("move",() => console.log(leafletMap.project([23.5,-87.6],5)));
    //leafletMap.addEventListener("move",() => console.log(leafletMap.latLngToLayerPoint([29.1,-90.2])));

}
