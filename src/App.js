import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import NYCMap from './NYCMap';
import zipInfo from './data/zipInfo'
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {boroughInfo: []}
  this.getDataBorough = this.getDataBorough.bind(this)
  this.getDataZip = this.getDataZip.bind(this)
  this.setUpdata = this.setUpdata.bind(this)
  this.year = 2018
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

  async setUpdata(){
    const colors = ['#ffccba', '#f48d69', '#f76836', '#f94202']
    zipInfo.features.forEach(async (x) => {
      x.properties.filmInfo = await this.getDataZip(x.properties.postalCode, this.year)
      if(x.properties.filmInfo.length < 20){
        x.properties.fill = colors[0]
      }
      else if(x.properties.filmInfo.length < 50){
        x.properties.fill = colors[1]
      }
      else if(x.properties.filmInfo.length < 70){
        x.properties.fill = colors[2]
      } else {
        x.properties.fill = colors[3]
      }
    })
  }

  async getDataZip(zip, year){
    let zipYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&zipcode_s=${zip}`
    let response = await axios.get(zipYear)
    return response.data;
  }

  async componentDidMount(){
    let year = this.year
    let brooklynData = await this.getDataBorough('Brooklyn', year)
    let queensData = await this.getDataBorough('Queens', year)
    let bronxData = await this.getDataBorough('Bronx', year)
    let statenData = await this.getDataBorough('Staten Island', year)
    let manhattenData = await this.getDataBorough('Manhattan', year)
    let boroughInfo = { brooklynData, queensData, bronxData, statenData, manhattenData}
    this.setState({...this.state, boroughInfo})
    await this.setUpdata()
  }

  render() {
    let dataSet = []
    if(this.state.boroughInfo.brooklynData){
      dataSet = [this.state.boroughInfo.brooklynData.length, this.state.boroughInfo.queensData.length, this.state.boroughInfo.bronxData.length, this.state.boroughInfo.statenData.length, this.state.boroughInfo.manhattenData.length]
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2> What's Filming Where?</h2>
          <BarChart data={dataSet} size={[400, 450]} />
          <NYCMap data={zipInfo}/>
        </div>
      </div>
    );
  }
}

export default App;

//https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=Queens&subcategoryname=Episodic series
