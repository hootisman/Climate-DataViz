import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ClimateInfo from './components/Header.jsx'
import DataViz from './components/Visualizations.jsx'

function App() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const newposition = Math.floor(window.scrollY/200)
      setScrollPosition(newposition)
      console.log(newposition)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])



  return (
    <>
      <ClimateInfo />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
      <TextTest />
    </>
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
