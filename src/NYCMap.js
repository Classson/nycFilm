import React, { Component } from 'react'
import './App.css'
import boroughInfo from './data/boroughInfo'
import { geoMercator, geoPath } from 'd3-geo'

class NYCMap extends Component {
  render(){
    let zipCodes
    const width = 500
    const height = 500
    if(this.props.stateZips.info.length){
    const projection = geoMercator()
    .scale(this.props.stateZips.scale)
    .center(this.props.stateZips.center)
    .translate([(width) / 2, (height)/2]);
    const pathGenerator = geoPath().projection(projection)

    console.log('props ', this.props)

      zipCodes = this.props.stateZips.info
      .map((d,i) =>
      <path
      fill={this.props.stateZips.info[i].fill}
      // className={this.props.stateZips[i].features.properties.PO_NAME}
      key={'path' + i}
      d={pathGenerator(d.features)}
       />)
    }

    return (
      this.props.stateZips.info.length ?
    <div className="map" className="section"><svg width={width} height={height}> {zipCodes}
      </svg></div> : <img
          src="https://media.giphy.com/media/ILhyncSuN62qc/giphy.gif"
        />)
  }
}

export default NYCMap
