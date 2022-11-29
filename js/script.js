let TData
let TData1
let y = 12 // 0 - 12


let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')


function color(cat){ // 13 + 17 + 12 + 9
    if (cat === 'HI' || cat === 'AK' || cat === 'CA' || cat === 'OR' || cat === 'WA' || cat === 'ID' || cat === 'NV' || cat === 'AZ' || cat === 'UT' || cat === 'MT' || cat === 'WY' || cat === 'CO' || cat === 'NM'){ return 'orange' } //west
    else if (cat === 'TX' || cat === 'OK' || cat === 'AR' || cat === 'LA' || cat === 'MS' || cat === 'AL' || cat === 'TN' || cat === 'KY' || cat === 'FL' || cat === 'GA' || cat === 'SC' || cat === 'NC' || cat === 'VA' || cat === 'WV' || cat === 'DC' || cat === 'DE' || cat === 'MD'){ return 'blue' } //mid-west
    else if (cat === 'ND' || cat === 'SD' || cat === 'NE' || cat === 'KS' || cat === 'MN' || cat === 'IA' || cat === 'MO' || cat === 'WI' || cat === 'IL' || cat === 'IN' || cat === 'MI' || cat === 'OH' || cat === 'PR'){ return 'green' } //south
    else if (cat === 'PA' || cat === 'NY' || cat === 'NJ' || cat === 'RI' || cat === 'CT' || cat === 'MA' || cat === 'VT' || cat === 'NH' || cat === 'ME'){ return 'red' } //northeast
    else console.log(cat)
}

let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(TData, (node) => {
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
            return color(stateC)
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
            tooltip.transition().style('visibility', 'visible')
            tooltip.html("Number of Tornadoes: "+va + '<br>'+ye+'-'+(parseInt(ye)+5).toString())
        })
        .on('mouseout', (tornado) => {
            tooltip.transition().style('visibility', 'hidden')
        })
        .on('click', () =>{// when implementing scrolling, instead of using changy, set y= at each part of the page
            console.log('click')
            changy()
            console.log(y)
            
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

function drawRect(){//flag1
    canvas.append('rect')
        .attr('fill', 'black')
        .attr('width', 1000)
        .attr('height', 600)
}

function changy(){ // using this to change data after every key press, will change to scrolling
    if (y === 12){
        y = 0
    }
    else {
        y += 1
    }
    //drawRect()
    draw()
}

function change(year, data){ // change what year of data we look at
    console.log("change-start")
    var d = [52]
    var ii = 0;
    //console.log(data['children'][0]['children'])
    for (var i = year*52; i < 52+year*52; i++){
        d[ii] = data['children'][0]['children'][i]
        ii++;
    }
    console.log(d)
    console.log("change-end")
    return d
}
function draw(){
    d3.json('data/torn3.json').then(
        (data, error) => {
            if(error){
                console.log(error)
            } else {
                // TData1  = data
                // console.log(TData1)
                TData = change(y, data)
                drawTreeMap()
            }
        }
    )
}
draw()
