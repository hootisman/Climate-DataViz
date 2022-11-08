// global variables
const yScale = d3.scaleLinear();
const xScale = d3.scaleLinear();
let data;
state_codes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
               'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
               'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
               'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
               'SD', 'TN', 'TX', 'UT', 'VT',' VA', 'WA', 'WV', 'WI', 'WY']

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    
});



var hurricaneData;

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([d3.csv('data/FireData.csv'),d3.csv("data/hurricaneidatest.csv")])
    .then(function (values) {
        //fire data
        data_initial = values[0];

        data = data_initial.map(element => ({
            Year: +element.Year,
            Size: +element.Size,
            State: element.State
        }));

        readyData = CalcYearData(2015);
        console.log(readyData);
        MathCalc(readyData);

        DrawBasic()


        //innovative visualization (hurricane path)
        tempHurricaneData = values[1];
        tempHurricaneData.shift();   //remove first element of array

        tempHurricaneData.forEach((d) =>{
            d["LAT"] = +d["LAT"];
            d["LON"] = +d["LON"];
        });
        
        hurricaneData = tempHurricaneData;
        hurricaneMapPlot();
        

    });

});

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

function DrawBasic()
{
    
}

function GetYearData(year)
{
    data_filtered = data.filter(function (element) {
        return element.Year == year;
    });
    return data_filtered;
}

// accepts country list with sum values and calculates relevant data
function MathCalc(list)
{
    array = [];
    list.forEach(element => {
        array.push(element.Size)
    });

    // calc standard deviation
    n = array.length
    mean = array.reduce((a, b) => a + b) / n
    stddev = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    
    sum = 0
    list.forEach(element => {
        sum += element.Size;
    });
    avg = sum/list.length;

    console.log("Mean: " + avg + "\nStd Dev: " + stddev);
    return [avg, stddev];
}

// accepts a list with state's current year fire data and returns a node
function CalcYearData(year)
{
    list = GetYearData(year);
    const calcData = {};
    
    list.forEach(element => {
        if (calcData[element.State] == undefined)
        {
            calcData[element.State] = element.Size
        }
        else
            calcData[element.State] = calcData[element.State] + element.Size
    });

    countryList = Object.keys(calcData);
    newList = [];
    for (i = 0; i < countryList.length; i++)
    {
        if (state_codes.includes(countryList[i]))
        {
            newList.push({
                Year: year,
                State: countryList[i],
                Size: calcData[countryList[i]]
            })
        }
    }
    
    return newList;
}