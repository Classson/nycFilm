import React, { Component } from 'react'
import './App.css'
import boroughInfo from './data/boroughInfo'
import { geoMercator, geoPath } from 'd3-geo'

class NYCMap extends Component {
  render(){
    const width = 500
    const height = 500
    const projection = geoMercator()
    .scale(50000)
    .center([-73.98, 40.71])
    .translate([(width) / 2, (height)/2]);
    const pathGenerator = geoPath().projection(projection)
    console.log('props are ', this.props)
      const zipCodes = this.props.data.features
      .map((d,i) =>
      <path
      className={this.props.data.features[i].properties.PO_NAME}
      fill={this.props.data.features[i].properties.PO_NAME}
      key={'path' + i}
      d={pathGenerator(d)}
       />)

    console.log('zipcodes ', zipCodes)
    console.log('props ', this.props.data.features)
    return (<div className="map" className="section"><svg width={width} height={height}> {zipCodes}
      </svg></div>)
  }
}

export default NYCMap
