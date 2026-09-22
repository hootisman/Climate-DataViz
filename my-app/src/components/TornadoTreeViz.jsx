import * as d3 from 'd3';
import {useState, useEffect, useRef} from 'react'

export default function TornadoTreeViz({year}){
    const canvasRef = useRef();
    const tooltipRef = useRef();
    const dataRef = useRef();
    const shownDataRef = useRef();

    const colorDict = {
        orange: ['HI', 'AK', 'CA', 'OR', 'WA', 'ID', 'NV', 'AZ', 'UT', 'MT', 'WY', 'CO', 'NM'], // west
        blue:   ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'FL', 'GA', 'SC', 'NC', 'VA', 'WV', 'DC', 'DE', 'MD'], // mid-west
        green:  ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'IN', 'MI', 'OH', 'PR'], // south
        red:    ['PA', 'NY', 'NJ', 'RI', 'CT', 'MA', 'VT', 'NH', 'ME'], // northeast
    }

    useEffect(() => {
        d3.select(canvasRef.current).attr('width',1000).attr('height', 600)
        Promise.all([
            d3.json('/data/torn3.json')
        ]).then(([importedData, error]) => {
            console.log("Inside useEffect, importedData:");
            if (error) {
                console.error('Error loading data:', error); 
            }else {
                dataRef.current = importedData;
            }
        });
    }, []);

    useEffect(() => {
        if (!dataRef.current) return; // Wait until data is loaded
        //changes the data based on the year, then draws the tree map
        console.log("Before/After year:" + year)
        console.log(shownDataRef.current)
        shownDataRef.current = [52]
        var ii = 0;
        //console.log(data['children'][0]['children'])
        for (var i = year*52; i < 52+year*52; i++){
            shownDataRef.current[ii] = dataRef.current['children'][0]['children'][i]
            ii++;
        }

        console.log(shownDataRef.current)


        drawTreeMap();
    }, [year]);

    function drawTreeMap() {
        //create the tree
        let hierarchy = d3.hierarchy(shownDataRef.current, (node) => {
            //console.log(node['children'])
            return node
        }).sum((node) => {
            return node['value']
        }).sort((node1, node2) => {
            return node2['value']-node1['value']
        })
        console.log(hierarchy.leaves())

        let createTreeMap = d3.treemap()
            .size([1000,600])
            //.padding(2) //flag1

        createTreeMap(hierarchy)

        let tornTiles = hierarchy.leaves()
        
        //drawing
        const canvas = d3.select(canvasRef.current)

        let block = canvas.selectAll('g')
            .data(tornTiles)
            .join('g')
            .attr('transform', (tornado) => {
                return 'translate(' + tornado['x0']+', '+tornado['y0']+')'
            })
            //.padding('2px')
            
            

        block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (tornado) => {
                let stateC = tornado['data']['state']
                //console.log(stateC)
                return getColorForState(stateC)
            })
            .attr('state-', (tornado) => {
                return tornado['data']['state']
            })
            .attr('value-', (tornado) => {
                return tornado['data']['value']
            })
            .attr('year-', (tornado) => {
                return tornado['data']['year']
            })
            .attr('width', (tornado) => {
                return tornado['x1']-tornado['x0']
            })
            .attr('height', (tornado) => {
                return tornado['y1']-tornado['y0']
            })
            .attr('stroke-width', '3')
            .on('mouseover', (e,tornado) => {
                let va = tornado['data']['value']
                let ye = tornado['data']['year']
                let tooltip = d3.select(tooltipRef.current)
                tooltip.transition().style('visibility', 'visible')
                tooltip.html("Number of Tornadoes: "+va + '<br>'+ye+'-'+(parseInt(ye)+5).toString())
            })
            .on('mouseout', (tornado) => {
                let tooltip = d3.select(tooltipRef.current)
                tooltip.transition().style('visibility', 'hidden')
            })
            .on('click', () =>{// when implementing scrolling, instead of using changy, set y= at each part of the page
                console.log('click')
                //changy()    //change year manually
                //console.log(yYear1)
                
            })
            


        block.append('text')
            .text((tornado) => {
                return tornado['data']['state']
            })
            .attr('x', 5)
            .attr('y', 20)

        block.append('text')
            .text((tornado) => {
                return tornado['data']['value']
            })
            .attr('x', 5)
            .attr('y', 35)
    }

    function getColorForState(cat) {
        for (const [colorName, states] of Object.entries(colorDict)) {
            if (states.includes(cat)) return colorName
        }
        return 'red'
    }

    return (
          <div id='container'>
            <svg ref={canvasRef} id='canvas'></svg>
            <div id='rightSide'>
                <div ref={tooltipRef} id='tooltip'>
    
                </div>
                <svg id='legend'>
                    <g>
                        <rect className="legend-item" x="10" y="0" width="40" height="40" fill="orange"></rect>
                        <text x="60" y="20" fill="white">West</text>
                    </g>
                    <g>
                        <rect className="legend-item" x="10" y="40" width="40" height="40" fill="blue"></rect>
                        <text x="60" y="60" fill="white">Mid-West</text>
                    </g>
                    <g>
                        <rect className="legend-item" x="10" y="80" width="40" height="40" fill="green"></rect>
                        <text x="60" y="100" fill="white">South</text>
                    </g>
                    <g>
                        <rect className="legend-item" x="10" y="120" width="40" height="40" fill="red"></rect>
                        <text x="60" y="140" fill="white">North-East</text>
                    </g> 
                </svg>
            </div>
        </div>
    );
}