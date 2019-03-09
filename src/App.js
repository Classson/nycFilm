import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import NYCMap from './NYCMap';
import zipInfo from './data/zipInfo';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = { boroughInfo: [], stateZips: [] };
    this.getDataBorough = this.getDataBorough.bind(this);
    this.getDataZip = this.getDataZip.bind(this);
    this.setUpdata = this.setUpdata.bind(this);
    this.year = 2018;
  }

  async getDataBorough(borough, year) {
    let boroughYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&borough=${borough}&$limit=10000`;
    let response = await axios.get(boroughYear);
    return response.data;
    //selecting by year
    //https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%202014
    //select by borough
    // `https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=${borough}`
    //select by year and borough
    // `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&borough=${borough}`
  }

  async setUpdata() {
    let lengths = await Promise.all(
      zipInfo.features.map(async (x, i) => {
        x.properties.filmInfo = await this.getDataZip(x.properties.postalCode, this.year);
        x.properties.filmNum = x.properties.filmInfo.length.toString()
        let colors = ['#dbdbdb','#ffa500', '#c98304', '#a86d03', '#7f5201']
        let obj = {}
        obj.features = x
        obj.info = x.properties.filmInfo
        obj.length = x.properties.filmInfo.length
        if(x.properties.filmInfo.length === 0){
          obj.fill = colors[0]
        }
        else if(x.properties.filmInfo.length < 5){
          obj.fill = colors[1]
        }
        else if(x.properties.filmInfo.length < 10){
          obj.fill = colors[2]
        }
        else if(x.properties.filmInfo.length < 25){
          obj.fill = colors[3]
        } else {
          obj.fill = colors[4]
        }
        return obj
      })
    );
    return lengths
  }

  // async function logUsers (userIds)  {
  //   await Promise.all(userIds.map(async userId => {
  //     const response = await fetch(`/api/users/${userId}`);
  //     const user = await response.json();
  //     console.log(user);
  //   }));
  // }

  async getDataZip(zip, year) {
    let zipYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&zipcode_s=${zip}`;
    let response = await axios.get(zipYear);
    return response.data;
  }

  async componentDidMount() {
    let year = this.year;
    let brooklynData = await this.getDataBorough('Brooklyn', year);
    let queensData = await this.getDataBorough('Queens', year);
    let bronxData = await this.getDataBorough('Bronx', year);
    let statenData = await this.getDataBorough('Staten Island', year);
    let manhattenData = await this.getDataBorough('Manhattan', year);
    let boroughInfo = {
      brooklynData,
      queensData,
      bronxData,
      statenData,
      manhattenData,
    };
    this.setState({ ...this.state, boroughInfo });
    let newArr = await this.setUpdata();
    this.setState({...this.state, stateZipInfo: zipInfo, stateZips: newArr})
  }

  render() {
    let dataSet = [];
    if (this.state.boroughInfo.brooklynData) {
      dataSet = [
        this.state.boroughInfo.brooklynData.length,
        this.state.boroughInfo.queensData.length,
        this.state.boroughInfo.bronxData.length,
        this.state.boroughInfo.statenData.length,
        this.state.boroughInfo.manhattenData.length,
      ];
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2> What's Filming Where?</h2>
          <BarChart data={dataSet} size={[400, 450]} />
          <NYCMap stateZips={this.state.stateZips} />
        </div>
      </div>
    );
  }
}

export default App;

//https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=Queens&subcategoryname=Episodic series
