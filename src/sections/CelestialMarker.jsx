import React from 'react'
import About from './About'
import Projects from './Projects'
import Publications from './Publications'
import Contact from './Contact'
import PlanetMarker from './PlanetMarker'
import RingedPlanetMarker from './RingedPlanetMarker'

export default function CelestialMarker({ item, active }) {
  if (item.id === 'about') {
    return <About active={active} />
  }

  if (item.id === 'projects') {
    return <Projects active={active} />
  }

  switch (item.type) {
    case 'planet':
      return <PlanetMarker active={active} color={item.color} />
    case 'ringed':
      return <RingedPlanetMarker active={active} color={item.color} />
    case 'binary':
      return <Publications active={active} color={item.color} />
    case 'station':
      return <Contact active={active} color={item.color} />
    default:
      return <PlanetMarker active={active} color={item.color} />
  }
}
