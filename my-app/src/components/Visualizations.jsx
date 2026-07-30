import * as d3 from 'd3';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'   // leaflet needs its CSS too, easy to forget

export default function DataViz() {
    return (
        <>
        <div className="myContainer1">
            <div id="line_div" className="border-dark bg-light shadow-sm">
                <span id="character-name"></span>
                <svg id="line_svg"></svg>
            </div>
        </div>
        
        </>
    );
}