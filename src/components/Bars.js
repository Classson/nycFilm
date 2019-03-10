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
      data.map(datum =>
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
    const text = (
      data.map(datum =>
        <text
          key={datum.name}
          text={datum.name}
          x={xScale(datum.name)}
          y={yScale(datum.number + 50)}
          height={height - margins.bottom - scales.yScale(datum.number)}
          fill='black'
        />,
      )
    )

    return (
      <g>{bars}</g>
    )
  }
}
