import React, { Component } from 'react';
import '../App.css';
import { geoMercator, geoPath } from 'd3-geo';

class NYCMap extends Component {
  render() {
    let zipCodes;
    const width = 500;
    const height = 500;
    let colors
    if(this.props.stateZips.info.length){
    }
    if (this.props.stateZips.info.length) {
      if(this.props.stateZips.info.length < 6){
        colors = [{color: this.props.colors[0], range:'0'}, {color: this.props.colors[1], range:'1 - 1,000'}, {color: this.props.colors[2], range:'1,001 - 2,000'}, {color: this.props.colors[3], range:'2,001 - 3,000'}, {color: this.props.colors[4], range:'3,001+'}]
      } else {
        colors = [{color: this.props.colors[0], range:'0'}, {color: this.props.colors[1], range:'1-5'}, {color: this.props.colors[2], range:'6-10'}, {color: this.props.colors[3], range:'11-15'}, {color: this.props.colors[4], range:'16-20'}, {color: this.props.colors[5], range:'21-25'}, {color: this.props.colors[6], range:'26+'}]
      }
      const projection = geoMercator()
        .scale(this.props.stateZips.scale)
        .center(this.props.stateZips.center)
        .translate([width / 2, height / 2]);
      const pathGenerator = geoPath().projection(projection);

      zipCodes = this.props.stateZips.info.map((d, i) => (
        <path
          fill={this.props.stateZips.info[i].fill}
          key={'path' + i}
          d={pathGenerator(d.features)}
        />
      ));
    }

    return this.props.stateZips.info.length ? (
      <div className="map" className="section">
        <svg width={width} height={height}>
          {' '}
          {zipCodes}
        </svg>
        <div className="legend">
          <h3>Legend</h3>
          <p>Number of Permits Per Year</p>
          {colors.map(color => {
            return <div className="legendPoint" key={color.color}>
            <div className="sample" id={`a${color.color.slice(1)}`}></div>
            <p>{color.range}</p>
            </div>
          })}

        </div>
      </div>
    ) : (
      <img
        src="https://media.giphy.com/media/QeCYm4ghfbs0o/giphy.gif"
      />
    );
  }
}

export default NYCMap;
