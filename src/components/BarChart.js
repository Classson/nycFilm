import React, { Component } from 'react'
import '../App.css'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class BarChart extends Component {
  constructor(props){
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
    this.setupFilmData = this.setupFilmData.bind(this)
    this.data = []
  }

  setupFilmData(){
    let data = this.props.film.info
    let allFilms = []
    let categories = [{name: 'Film', number: 0}, {name: 'Television', number: 0}, {name: 'Student', number: 0}, {name: 'Commercial', number: 0}, {name: 'Still Photography', number: 0}, {name: 'WEB', number: 0}, {name: 'Theater', number: 0}, {name: 'Music Video', number: 0}, {name: 'Documentary', number: 0}]
    console.log('running')
    console.log('data is ', data)
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
    this.createBarChart()
  }

  componentDidUpdate(){
    this.createBarChart()
  }

  createBarChart(){
    const node = this.node;
    const dataMax = max(this.data.map(x => x.number))
    console.log('data max is ', dataMax)
    const yScale = scaleLinear()
      .domain([0, dataMax + 50])
      .range([0, this.props.size[1]])

  select(node)
    .selectAll('rect')
    .data(this.data)
    .enter()
    .append('rect')

  select(node)
    .selectAll('rect')
    .data(this.data)
    .exit()
    .remove()

  select(node)
    .selectAll('rect')
    .data(this.data)
    .attr('x', (d,i) => (i * 50)+ 30)
    .attr('y', d => this.props.size[1] - yScale(d.number) + 50)
    .attr('height', d => yScale(d.number))
    .attr('width', 30)
    .style('fill', '#ff5d00')
    .on('mouseover', function(d) {
      select('rect')
        this.style="fill:#ffd000"
    })
    .on('mouseout', function(d) {
      select('rect')
      this.style="fill:#ff5d00"
    })

  select(node)
    .selectAll('text')
    .data(this.data)
    .enter()
    .append('text')

  select(node)
    .selectAll('text')
    .data(this.data)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('x', (d, i) => (i * 50)+ 30)
    .attr('y', d => this.props.size[1] - yScale(d.number) +50)
}


  render(){
    let categories = this.setupFilmData()
    this.data = categories;
    console.log('cats ', this.data)
    console.log('props ', this.props);
    return (this.props.data.length ? <div className="barChart" className="section"><svg ref = {node => this.node = node} width={500} height={300}></svg></div> : <div>Loading</div>)
  }
}

export default BarChart
