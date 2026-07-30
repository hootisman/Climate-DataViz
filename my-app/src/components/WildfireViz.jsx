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
