import React, { Component } from 'react'

export default class Bars extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { scales, margins, data, svgDimensions } = this.props
    const { xScale, yScale } = scales
    const { height } = svgDimensions

    const bars = (
      data.map(point =>
        <rect
          key={point.name}
          x={xScale(point.name)}
          y={yScale(point.number)}
          height={height - margins.bottom - scales.yScale(point.number)}
          width={xScale.bandwidth()}
          fill='#c98304'
        />,
      )
    )
    const text = (
      data.map(point =>
        <text
          key={point.name}
          text={point.name}
          x={xScale(point.name)}
          y={yScale(point.number + 50)}
          height={height - margins.bottom - scales.yScale(point.number)}
          fill='black'
        />,
      )
    )

    return (
      <g>{bars}</g>
    )
  }
}
