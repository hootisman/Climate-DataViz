import * as d3 from 'd3';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'   // leaflet needs its CSS too, easy to forget
import {useState, useEffect} from 'react'

export default function WildfireViz() {
    let nodes_draw, nodes_labels;
    let data;
    let simulation = d3.forceSimulation()
        //.alphaMin(0.9)
        //.alphaTarget(0.899999)  
        .velocityDecay(0.4)
        .force("x", d3.forceX().x(function(d) {
            return centres[getFireStatus(d.State)].x;
        }))
        .force("y", d3.forceY().y(function(d) {
            return centres[getFireStatus(d.State)].y;
        }))
        //.force("y", d3.forceY().strength(0.002))
        .force('collision', d3.forceCollide().radius(d => d.radius+1).iterations(2))
        .on('tick', () => {
            nodes_draw
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            nodes_labels
                .attr('x', d => d.x)
                .attr('y', d => d.y)
        });

    useEffect(() => {
        d3.csv('./assets/FireData.csv').then(data => {
          var data_initial = values[0];

          data = data_initial.map(element => ({
              Year: +element.Year,
              Size: +element.Size,
              State: element.State
          }));
        });

        const colorScale = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .range(["#edc949", "#59a14f", "#e15759"])

        nodes_draw = svg.selectAll("circle")
        .data(nodes, d => d.State)
        .join("circle")
            .attr('r', d => d.radius)
            .attr('fill', d => colorScale(getFireStatus(d.State)))
            .attr('opacity', 1)
            .attr('class', '_wildfire_node')
                        
        nodes_labels = svg.selectAll("ntext")
        .data(nodes)
        .join("text")
            .text(d => d.State)
            .style('text-anchor', 'middle')
            .style('font-size', 20)
            .attr('dy', '.3em')

    }, []);

    return (
        <></>
    );
}

export function TempLineViz(){
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

    function drawUSTemperatureChangeLineGraph(data) {
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

        const svg = d3.select("#usTemperatureChange")
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
        ]).then(([data]) => {
            data = data
                .filter((d) => d["Country Code"] === "USA") // Only keep US data
                .map((d) => ({
                year: +d["year"],
                tempChange: +d["tem_change"],
                }));
            console.log("temp change data (chart 1)", data);
            
            drawUSTemperatureChangeLineGraph(data);
        });
    }, []);

    return (
    <div className="myContainer1">
        <div id="line_div" className="border-dark bg-light shadow-sm">
            <span id="character-name"></span>
            <svg id="line_svg"></svg>
        </div>
    </div>
    );
}