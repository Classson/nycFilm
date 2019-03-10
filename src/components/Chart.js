import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'

import Axes from '../Axes'
import Bars from '../Bars'

class Chart extends Component {
  constructor(props) {
    super(props)
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
  }
//data needs value (number), title
  render() {
    let data = this.props.data
    const margins = { top: 50, right: 20, bottom: 100, left: 60 }
    const svgDimensions = {
      width: 500,
      height: 500
    }

    const maxValue = Math.max(...data.map(d => d.value))

    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d.title))
      .range([margins.left, svgDimensions.width - margins.right])

    const yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top])

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
    )
  }
}

export default Chart;