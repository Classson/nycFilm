import React, { Component } from 'react'
import './App.css'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class BarChart extends Component {
  constructor(props){
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount(){
    console.log('bar props ', this.props)
    this.createBarChart()
  }

  componentDidUpdate(){
    this.createBarChart()
  }

  createBarChart(){
    const node = this.node;
    const dataMax = max(this.props.data)
    const yScale = scaleLinear()
      .domain([0, dataMax + 300])
      .range([0, this.props.size[1]])

  select(node)
    .selectAll('rect')
    .data(this.props.data)
    .enter()
    .append('rect')

  select(node)
    .selectAll('rect')
    .data(this.props.data)
    .exit()
    .remove()

  select(node)
    .selectAll('rect')
    .data(this.props.data)
    .attr('x', (d,i) => (i * 60)+ 52)
    .attr('y', d => this.props.size[1] - yScale(d) + 5)
    .attr('height', d => yScale(d))
    .attr('width', 50)
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
    .data(this.props.data)
    .enter()
    .append('text')

  select(node)
    .selectAll('text')
    .data(this.props.data)
    .exit()
    .remove()

  select(node)
    .selectAll('text')
    .data(this.props.data)
    .enter()
    .append('text')
    .text(d => d)
    .attr('x', (d, i) => (i * 60)+ 55)
    .attr('y', d => this.props.size[1] - yScale(d) - 3)
}


  render(){
    console.log('bar props ', this.props)
    return (this.props.data.length ? <div className="barChart" className="section"><svg ref = {node => this.node = node} width={400} height={500}></svg></div> : <div>Loading</div>)
  }
}

export default BarChart
