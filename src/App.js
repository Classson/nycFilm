import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import NYCMap from './NYCMap';
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {}
  this.getDataBorough = this.getDataBorough.bind(this)
  this.getDataZip = this.getDataZip.bind(this)
  }

  async getDataBorough(borough, year){
    let boroughYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&borough=${borough}&$limit=10000`
    let response = await axios.get(boroughYear)
    return response.data;
    //selecting by year
    //https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%202014
    //select by borough
    // `https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=${borough}`
    //select by year and borough
    // `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&borough=${borough}`
  }

  async getDataZip(zip, year){
    let zipYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&zipcode_s=${zip}`
    let response = await axios.get(zipYear)
    return response.data;
  }

  async componentDidMount(){
    let year = 2018
    let brooklynData = await this.getDataBorough('Brooklyn', year)
    let queensData = await this.getDataBorough('Queens', year)
    let bronxData = await this.getDataBorough('Bronx', year)
    let statenData = await this.getDataBorough('Staten Island', year)
    let manhattenData = await this.getDataBorough('Manhattan', year)
    let boroughInfo = { brooklynData, queensData, bronxData, statenData, manhattenData}
    console.log(boroughInfo)
    this.setState(boroughInfo)

  }

  render() {
    let dataSet = []
    if(this.state.brooklynData){
      dataSet = [this.state.brooklynData.length, this.state.queensData.length, this.state.bronxData.length, this.state.statenData.length, this.state.manhattenData.length]
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2> What's Filming Where?</h2>
          <BarChart data={dataSet} size={[400, 450]} />
          <NYCMap />
        </div>
      </div>
    );
  }
}

export default App;

//https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=Queens&subcategoryname=Episodic series
