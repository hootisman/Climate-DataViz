

var hurricaneData;

document.addEventListener('DOMContentLoaded', function () {
    hurricaneMain();
});

function hurricaneMain(){
    d3.csv("hurricaneidatest.csv").then(data =>{
        data.shift();   //remove first element of array

        data.forEach((d) =>{
            d["LAT"] = +d["LAT"];
            d["LON"] = +d["LON"];
        });
        
        hurricaneData = data;
        hurricaneMapPlot();
    });
}
function hurricaneMapPlot(){
    var leafletMap = L.map('leaflet-map',{zoomControl: false,minZoom: 5, maxZoom: 5}).setView([33.448, -80.074], 5);
    
    console.log(hurricaneData);
    
    // Add a tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(leafletMap);


    var svg = d3.select("#map_svg");

    console.log(leafletMap.getBounds());
    var bounds = leafletMap.getBounds();
    leafletMap.setMaxBounds(bounds);

    L.rectangle(bounds).addTo(leafletMap);
    //leafletMap.fitBounds(bounds);

    svg.select('g').remove();

    const g = svg.append('g');

    g.selectAll('circle')
                    .data(hurricaneData)
                    .enter()
                    .append('circle')      
                    .style('fill','yellow')
                    .attr('cx', d => leafletMap.latLngToLayerPoint([d["LAT"],d["LON"]])["x"])
                    .attr('cy', d => leafletMap.latLngToLayerPoint([d["LAT"],d["LON"]])["y"])
                    .attr('r', 3);

    var svgOverlay = L.svgOverlay(document.querySelector("#map_svg"), bounds, {
        opacity: 0.7,
        interactive: true
    }).addTo(leafletMap);


    


    //leafletMap.addEventListener("move",() => console.log(leafletMap.layerPointToLatLng([-10,0])));
    //leafletMap.addEventListener("move",() => console.log(leafletMap.latLngToLayerPoint([45.583289756006316,-108.63281250000001])));

}
