import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'
import Axes from './Axes'
import Bars from './Bars'

export default class Chart extends Component {
  constructor() {
    super()
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
    this.setupFilmData = this.setupFilmData.bind(this)
  }

  setupFilmData(){
    let data = this.props.film.info
    let allFilms = []
    let categories = [{name: 'Film', number: 0}, {name: 'Television', number: 0}, {name: 'Student', number: 0}, {name: 'Commercial', number: 0}, {name: 'Still Photography', number: 0}, {name: 'WEB', number: 0}, {name: 'Theater', number: 0}, {name: 'Music Video', number: 0}, {name: 'Documentary', number: 0}]
    data.forEach(zip => {
      if(zip.info){
        allFilms.push(...zip.info)
      }
    })
    allFilms.forEach(project => {
      if(project.category === 'Film'){
        categories[0].number++
      }
      if(project.category === 'Television'){
        categories[1].number++
      }
      if(project.category === 'Student'){
        categories[2].number++
      }
      if(project.category === 'Commercial'){
        categories[3].number++
      }
      if(project.category === 'Still Photography'){
        categories[4].number++
      }
      if(project.category === 'WEB'){
        categories[5].number++
      }
      if(project.category === 'Theater'){
        categories[6].number++
      }
      if(project.category === 'Music Video'){
        categories[7].number++
      }
      if(project.category === 'Documentary'){
        categories[8].number++
      }
    })
    return categories
  }

  componentDidMount(){
    if(this.props.film.info > 5){
      this.setState(true)
    }
  }

  render() {
    let chartView = false
    if(this.props.film.info.length > 10){
      chartView = true
    }
    let categories = this.setupFilmData()
    const margins = { top: 50, right: 20, bottom: 100, left: 60 }
    const svgDimensions = { width: 800, height: 400 }

    const maxValue = Math.max(...categories.map(d => d.number))

    // scaleBand type
    const xScale = this.xScale
      .padding(0.5)
      // scaleBand domain should be an array of specific values
      // in our case, we want to use movie titles
      .domain(categories.map(d => d.name))
      .range([margins.left, svgDimensions.width - margins.right])

     // scaleLinear type
    const yScale = this.yScale
       // scaleLinear domain required at least two values, min and max
      .domain([0, maxValue + (maxValue/10)])
      .range([svgDimensions.height - margins.bottom, margins.top])

    return ( chartView ?
      <svg width={svgDimensions.width} height={svgDimensions.height}>
         <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={categories}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
    : <div></div>)
  }
}

