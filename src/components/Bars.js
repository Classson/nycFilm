import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'

export default class Bars extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log('bars props are::', this.props)
    const { scales, margins, data, svgDimensions } = this.props
    const { xScale, yScale } = scales
    const { height } = svgDimensions

    const bars = (
      this.props.data.map(datum =>
        <rect
          key={datum.name}
          x={xScale(datum.name)}
          y={yScale(datum.number)}
          height={height - margins.bottom - scales.yScale(datum.number)}
          width={xScale.bandwidth()}
          fill='#c98304'
        />,
      )
    )
        console.log('bars are ', bars)
    return (
      <g>{bars}</g>
    )
  }
}
