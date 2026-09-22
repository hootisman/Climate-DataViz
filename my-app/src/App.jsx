import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import * as d3 from 'd3'
import ClimateInfo from './components/Header.jsx'
import TempLineViz from './components/TempLineViz.jsx'
import NaturalDisasterDamagesViz from './components/NatureDisastersViz.jsx'
import WildfireViz from './components/WildfireViz.jsx'
import TornadoTreeViz from './components/TornadoTreeViz.jsx'
import HurricaneViz from './components/HurricaneViz.jsx'


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const remap = (num, min1, max1, min2, max2) => min2 + ((num - min1) * (max2 - min2)) / (max1 - min1)
const isInRange = (value, min, max) => value >= min && value < max;

function App() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const wildfireStartScrollPos = 35;    //the scroll position that the wildfire viz should start appearing
  const tornadoStartScrollPos = 65;     //the scroll position that the tornado viz should start appearing
  //todo: get start pos by directly going through arrays
  const chartsList = [
      {min:0, max:5, component: "#intro_area"},
      {min:5, max:10, component: "#intro_area2"},
      {min:10, max:15, component: "#intro_area3"},
      {min:15, max:20, component: "#usTemperatureChangeOuter"},
      {min:20, max:30, component: "#usNaturalDisasterDamagesOuter"},
      {min:30, max:35, component: "#usNaturalDisasterDeathsOuter"},
      {min:35, max:65, component: ".myContainer1"},
      {min:65, max:85, component: "#container"},
      {min:85, max:97, component: ".hurricaneOuter"},
      {min:97, max:100, component: "#exit_area"},
      {min:1000, max:1003, component: ".empty_div"},
  ];

  const infoList = [
      {min:0, max:15, component: ".empty_div"},
      {min:15, max:20, component: ".text_area3"},
      {min:20, max:25, component: ".text_area4"},
      {min:25, max:30, component: ".text_area5"},
      {min:30, max:35, component: ".text_area6"},
      {min:35, max:59, component: ".text_area1"},
      {min:59, max:65, component: ".text_area2"},
      {min:65, max:85, component: ".text_area7"},
      {min:85, max:97, component: ".text_area8"},
      {min:97, max:100, component: ".empty_div"},
  ];


  useEffect(() => {
    const handleScroll = () => {
      const newposition = Math.floor(window.scrollY/200)
      setScrollPosition(newposition)
      
      toggleChartAndText(newposition)
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0) 
    toggleChartAndText(0) // Initialize the first chart and text on page load

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function toggleChartAndText(position) {
      let component = chartsList.filter(chart => position >= chart.min && position < chart.max)[0]?.component
      let text = infoList.filter(info => position >= info.min && position < info.max)[0]?.component

      //hide previous chart + text
      d3.selectAll(".shown").transition().duration(50).style("opacity", 0)
      d3.selectAll(".shown").style("z-index", 0)
      d3.selectAll(".shown").classed("shown", false)

      //show new chart + text
      d3.select(text).transition().duration(50).style("opacity", 1)
      d3.select(text).classed("shown", true);
      d3.select(component).transition().duration(50).style("opacity", 1)
      d3.select(component).style("z-index", 1)
      d3.select(component).classed("shown", true);
  }

  return (
    <div style={{height: '20000px'}} aria-hidden="true"> {/* Set a large height to enable scrolling */}
      <ClimateInfo />
      <TempLineViz />
      <NaturalDisasterDamagesViz />
      <WildfireViz year = {clamp(1992 + scrollPosition - wildfireStartScrollPos - 4, 1992, 2015)} />
      <TornadoTreeViz year={clamp(Math.floor(remap(scrollPosition, tornadoStartScrollPos, 83, 0, 12)), 0, 12)} />
      <HurricaneViz currentHurricane={clamp(Math.floor(remap(scrollPosition, 85, 97, 0, 6)), 0, 6)}/>
    </div>
  )
}

function TextTest() {
  return (
    <>
      <p>
          Scroll down to see the position update. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Curabitur sit amet velit ut purus condimentum tincidunt. Suspendisse sit amet purus quam. 
          Nulla facilisi. Sed vel felis leo. Pellentesque ut dui quam.
        </p>
        <p>
          Nulla convallis lectus eget turpis tempor, sed elementum lacus aliquet. Sed maximus ligula at dolor 
          vehicula, ac consequat nunc pellentesque. Cras auctor volutpat interdum. Sed vel felis leo. 
          Pellentesque ut dui quam. Suspendisse sit amet purus quam.
        </p>
        <p>
          Curabitur in velit sit amet velit ullamcorper iaculis non id urna. Aenean nec ante erat. 
          Maecenas sollicitudin neque in quam elementum placerat. Phasellus feugiat dolor ac odio mollis, 
          euismod feugiat nisi ullamcorper. Mauris sed velit mi.
        </p>
        <p>
          Donec vitae libero vitae felis pharetra fermentum. Integer malesuada venenatis est in laoreet. 
          Vestibulum feugiat laoreet nunc at scelerisque. Etiam convallis felis nec justo iaculis, et elementum 
          enim sodales. Sed convallis volutpat orci in volutpat. Suspendisse facilisis sollicitudin.
        </p>
        <p>
          Integer malesuada venenatis est in laoreet. Vestibulum feugiat laoreet nunc at scelerisque. 
          Etiam convallis felis nec justo iaculis, et elementum enim sodales. Sed convallis volutpat orci in volutpat.
        </p>
    </>
  )
}


export default App
