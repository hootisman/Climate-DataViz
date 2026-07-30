import * as d3 from 'd3';
import {useState, useEffect} from 'react'


export default function TempLineViz(){
    const width = 1082;
    const height = 400;
    const margin = {
        top: 10,
        right: 20,
        bottom: 45,
        left: 80,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const lineWidth = 2;
    const lineColor = d3.schemeSet2[0];
    let svg, data;

    function drawUSTemperatureChangeLineGraph() {
        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.year))
            .range([0, innerWidth])
            .nice();
        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.tempChange))
            .range([innerHeight, 0])
            .nice();
        const line = d3
            .line()
            .x((d) => xScale(d.year))
            .y((d) => yScale(d.tempChange));

        svg = d3.select("#usTemperatureChange")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .attr("class", "chart");
        const xAxisG = g
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        const xAxisTitle = g
            .append("text")
            .attr("class", "x-axis-title")
            .attr("transform", `translate(${innerWidth / 2},${innerHeight + 40})`)
            .attr("text-anchor", "middle")
            .attr("fill", "currentColor")
            .text("Year");
        const yAxisG = g
            .append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale).ticks(5));
        const yAxisTitle = g
            .append("text")
            .attr("class", "y-axis-title")
            .attr(
            "transform",
            `translate(${-margin.left + 20},${innerHeight / 2})rotate(-90)`
            )
            .attr("text-anchor", "middle")
            .attr("fill", "currentColor")
            .text("Temperature Change (°C)");
        const zeroLine = g
            .append("line")
            .attr("class", "zero-line")
            .attr("stroke", "currentColor")
            .attr("stroke-dasharray", "4")
            .attr("x1", xScale.range()[0])
            .attr("x2", xScale.range()[1])
            .attr("y1", yScale(0))
            .attr("y2", yScale(0));
        const linePath = g
            .append("path")
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke-width", lineWidth)
            .attr("stroke", lineColor)
            .attr("d", line(data));
    }

    useEffect(() => {
        Promise.all([
            d3.csv('/data/Temperature_change_Data.csv')
        ]).then(([importedData]) => {
            data = importedData
                .filter((d) => d["Country Code"] === "USA") // Only keep US importedData
                .map((d) => ({
                year: +d["year"],
                tempChange: +d["tem_change"],
                }));
            console.log("temp change data (chart 1)", data);
            
            drawUSTemperatureChangeLineGraph();
        });
    }, []);

    return (
    <div className="card shadow mb-4" id="usTemperatureChangeOuter">
            <div className="card-body">
              <h5 className="card-title">US Temperature Change</h5>
              <div className="mb-2">
                <div id="usTemperatureChange"></div>
              </div>
              <p className="text-muted mb-0"></p>
                Data source:
                <a
                  href="https://www.kaggle.com/code/sevgisarac/climate-change/data"
                  target="_blank"
                  className="text-muted"
                  >Climate Change</a>
            </div>
    </div>
    );
}
