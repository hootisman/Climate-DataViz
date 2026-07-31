import * as d3 from 'd3';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'   // leaflet needs its CSS too, easy to forget
import {useState, useEffect, useRef} from 'react'

export default function HurricaneViz({currentHurricane}){

    const allDataRef = useRef();
    const leafletRef = useRef();
    const svgRef = useRef();

    const datasets = [
        d3.csv("/data/hurricanealma1970.csv"),
        d3.csv("/data/hurricanedanny1985.csv"),
        d3.csv("/data/hurricaneearl1998.csv"),
        d3.csv("/data/hurricanejeanne2004.csv"),
        d3.csv("/data/hurricanesally2020.csv"),
        d3.csv("/data/hurricaneida2021.csv")
    ];

    useEffect ( () => {
        Promise.all(datasets).then((values) => {
            allDataRef.current = values

            console.debug("Hurricane data")
            console.debug(allDataRef.current)
            console.debug("Hurricane Data Order")
            allDataRef.current.forEach((list) => {
                console.debug(list[0]['ISO_TIME_________'])
            });

            allDataRef.current.forEach((csv, index) => {
                //cleanup data
                var prevWind = +csv[0]["WMO WIND"];
                csv.forEach((d) => {
                    d["LAT"] = +d["LAT"];
                    d["LON"] = +d["LON"];
            
                    if(d["WMO WIND"] === ""){
                        d["WMO WIND"] = prevWind;
                    }else{
                        d["WMO WIND"] = +d["WMO WIND"];
                    }
                    
                    prevWind = d["WMO WIND"];
                    
                })
                
                allDataRef.current[index] = csv
            })


            leafletRef.current = L.map('leaflet-map',
                {
                    zoomControl: false,minZoom: 5, maxZoom: 5,
                    scrollWheelZoom: false,   
                    dragging: false,          
                    doubleClickZoom: false,
                    touchZoom: false,
                    boxZoom: false,
                })
                .setView([28.448, -78.074], 5);

            console.debug("Hurricane: Cleaned up")
            console.debug(allDataRef.current)
            console.debug("Leaflet map")
            console.debug(leafletRef.current)
            hurricaneMapPlot();
        });
    }, []);


    useEffect ( () => {
        if(!allDataRef.current) return;
        console.log("current hurricane index " + currentHurricane)
        hurricaneMapPlot();
    }, [currentHurricane]);

    function hurricaneMapPlot(){
        // Add a tile layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(leafletRef.current);

        d3.select("#hurri-path-svg").remove();

        var svg = d3.select("#leaflet-map").append("svg")
                                    .attr("id","hurri-path-svg")
                                    .attr("class","graph")
                                    .style('z-index', 1);
        var svgBounds = L.latLngBounds(
            L.latLng(90,180),
            L.latLng(-90,-180)
        );

        svg.select('g').remove();

        const g = svg.append('g');

        const radiusScale = d3.scaleLinear()
                                    .domain([0,140])
                                    .range([4,20]);
        const intensityScale = d3.scaleSequential(d3.interpolateTurbo)
                                    .domain([0,140]);
        
        var lines = g.append("path")
                            .data([allDataRef.current[currentHurricane]])
                            .style("stroke","black")
                            .style("stroke-width","10px")
                            .style("fill","none")
                            .attr("d",d3.line()
                                    .x((d) => leafletRef.current.project(L.latLng(d["LAT"],d["LON"]))["x"])
                                    .y((d) => leafletRef.current.project(L.latLng(d["LAT"],d["LON"]))["y"])
                                    .curve(d3.curveCardinal)
                                    );

        var circles = g.selectAll('circle')
                            .data(allDataRef.current[currentHurricane])
                            .enter()
                            .append('circle')      
                            .style('fill', d => intensityScale(d["WMO WIND"]))
                            .style("stroke","black")
                            .style("stroke-width","1px")
                            .attr('cx', d => leafletRef.current.project([d["LAT"],d["LON"]])["x"])
                            .attr('cy', d => leafletRef.current.project([d["LAT"],d["LON"]])["y"])
                            .transition()
                            .duration(1000)
                            .delay((d,i) => 75 * i)
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
        }).addTo(leafletRef.current);
    }

    return (
        <div className="hurricaneOuter">
            <div className="row" >
            <div className="col">
                <div id='leaflet-map' style={{width:'100%', height:'720px'}}></div>
            </div>
            </div>
        </div>
    );
}