import * as d3 from 'd3';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'   // leaflet needs its CSS too, easy to forget
import {useState, useEffect, useRef} from 'react'

export default function WildfireViz({year}) {
    const svgRef = useRef();
    const simRef = useRef();
    const dataRef = useRef();
    const nodesRef = useRef();
    const nodesClassRef = useRef({highFire: [], midFire: []});
    const nodesDrawRef = useRef();
    const nodesLabelsRef = useRef();
    const yearLabelRef = useRef();

    const state_codes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
                'SD', 'TN', 'TX', 'UT', 'VT',' VA', 'WA', 'WV', 'WI', 'WY'];

    const y_loc = 400;
    const centres = [{x: 260, y: y_loc}, {x: 640, y: y_loc}, {x: 1020, y: y_loc}];
    const radius_ = 25;


    useEffect(() => {
        Promise.all([
            d3.csv('/data/FireData.csv'),
        ]).then(([importedData]) => {

            const data = importedData.map(element => ({
                Year: +element.Year,
                Size: +element.Size,
                State: element.State
            }));
            dataRef.current = data;

            nodesClassRef.current = calcNodes(year, dataRef.current);

            //creates nodes (once)
            const uniqueStates = [...new Set(data.filter(d => d.Year === year).map(d => d.State))]
                .filter((s) => state_codes.includes(s))

            nodesRef.current = uniqueStates.map((state) => ({
                State: state,
                radius: radius_,
                x: Math.random() + getFireStatus(state) * 240 + 340,
                y: Math.random() * 180 + 270,
            }))

            //svg + labels
            const svg = d3.select(svgRef.current);

            yearLabelRef.current = svg.append('text').attr('className', 'axis-label')
                .attr('y', '635px')
                .attr('x', '640px')
                .attr('text-anchor', 'middle')
                .text(year)
                .style('font-size', '50px')
                .attr('className', '_yearLabel')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[0].y-260)
                .attr('x', centres[0].x)
                .attr('text-anchor', 'middle')
                .text('Low')
                .style('font-size', '40px')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[0].y-220)
                .attr('x', centres[0].x)
                .attr('text-anchor', 'middle')
                .text('0 - 10000 Acres')
                .style('font-size', '20px')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[1].y-260)
                .attr('x', centres[1].x)
                .attr('text-anchor', 'middle')
                .text('Medium')
                .style('font-size', '40px')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[1].y-220)
                .attr('x', centres[1].x)
                .attr('text-anchor', 'middle')
                .text('10001 - 100000 Acres')
                .style('font-size', '20px')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[2].y-260)
                .attr('x', centres[2].x)
                .attr('text-anchor', 'middle')
                .text('Large')
                .style('font-size', '40px')
                .attr('font-weight', '500');

            svg.append('text').attr('className', 'axis-label')
                .attr('y', centres[2].y-220)
                .attr('x', centres[2].x)
                .attr('text-anchor', 'middle')
                .text('100000+ Acres')
                .style('font-size', '20px')
                .attr('font-weight', '500');

            nodesDrawRef.current = svg.selectAll('circle')
                .data(nodesRef.current, (d) => d.State)
                .join('circle')
                .attr('r', (d) => d.radius)
                .attr('fill', (d) => getColor(getFireStatus(d.State)))
                .attr('class', '_wildfire_node')
            
            nodesLabelsRef.current = svg.selectAll('.node-label')
                .data(nodesRef.current, (d) => d.State)
                .join('text')
                .attr('class', 'node-label')
                .text((d) => d.State)
                .style('text-anchor', 'middle')

            const simulation = d3.forceSimulation(nodesRef.current)
                .velocityDecay(0.4)
                .force('x', d3.forceX().x((d) => centres[getFireStatus(d.State)].x))
                .force('y', d3.forceY().y((d) => centres[getFireStatus(d.State)].y))
                .force('collision', d3.forceCollide().radius((d) => d.radius + 1).iterations(2))
                .on('tick', () => {
                    nodesDrawRef.current
                        ?.attr('cx', (d) => d.x)
                        .attr('cy', (d) => d.y)
                    nodesLabelsRef.current
                        ?.attr('x', (d) => d.x)
                        .attr('y', (d) => d.y)
                })


            simRef.current = simulation
        });

        return () => {
            simRef.current?.stop();
        }
    }, []);

    useEffect(() => {
        if (!dataRef.current || !simRef.current) return // wait until effect 1 is done

        console.log('Updating wildfire viz for year:', year)

        nodesClassRef.current = calcNodes(year, dataRef.current);

        simRef.current
            .force('x', d3.forceX().x((d) => centres[getFireStatus(d.State)].x))
            .force('y', d3.forceY().y((d) => centres[getFireStatus(d.State)].y))
            .alphaTarget(0.3).restart(); // restart simulation with new nodes

        d3.select(svgRef.current).selectAll('._wildfire_node')
            .style('fill', (d) => getColor(getFireStatus(d.State)))

        yearLabelRef.current?.text(year)
    }, [year]); //runs whenever year changes

    function calcNodes(yearToCalc, data) {
        const yearData = data.filter((d) => d.Year === yearToCalc)
        const calcData = {}
        yearData.forEach((d) => { calcData[d.State] = (calcData[d.State] || 0) + d.Size })

        const highFire = [], midFire = []
        Object.entries(calcData).forEach(([state, size]) => {
        if (size > 100000) highFire.push(state)
        else if (size > 10000) midFire.push(state)
        })
        return { highFire, midFire }
    }
   
    function getFireStatus(state) {
        const { highFire, midFire } = nodesClassRef.current
        if (highFire.includes(state)) return 2
        if (midFire.includes(state)) return 1
        return 0
    }


    function getColor(num)
    {
    if (num == 0)
        return "#edc949";
    else if (num == 1)
        return "#59a14f";
    else if (num == 2)
        return "#e15759";
    }

    return (
        <div className="myContainer1">
            <div id="line_div" className="border-dark bg-light shadow-sm">
                <span id="character-name"></span>
                <svg ref = {svgRef} id="line_svg"></svg>
            </div>
        </div>
    );
}
