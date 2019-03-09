import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import NYCMap from './NYCMap';
import zipInfo from './data/zipInfo';
import boroughMapInfo from './data/boroughInfo'
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      boroughInfo: [],
      stateZips: [],
      year: '2018',
      overView: [],
      selectedView: [],
      manhattanZips: [],
      brooklynZips: [],
      queensZips: [],
      bronxZips: [],
      statenZips: [],
    };
    this.getDataBorough = this.getDataBorough.bind(this);
    this.getDataZip = this.getDataZip.bind(this);
    this.setUpdata = this.setUpdata.bind(this);
    this.setYear = this.setYear.bind(this)
    this.setView = this.setView.bind(this)
    this.setUpOverView = this.setUpOverView.bind(this)
  }

  async getDataBorough(borough, year) {
    let boroughYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&borough=${borough}&$limit=10000`;
    let response = await axios.get(boroughYear);
    return response.data;
  }

  async setUpdata() {
    let lengths = await Promise.all(
      zipInfo.features.map(async (x, i) => {
        x.properties.filmInfo = await this.getDataZip(
          x.properties.postalCode,
          this.state.year
        );
        x.properties.filmNum = x.properties.filmInfo.length.toString();
        let colors = ['#dbdbdb', '#ffa500', '#c98304', '#a86d03', '#7f5201'];
        let obj = {};
        obj.features = x;
        obj.info = x.properties.filmInfo;
        obj.length = x.properties.filmInfo.length;
        if (x.properties.filmInfo.length === 0) {
          obj.fill = colors[0];
        } else if (x.properties.filmInfo.length < 5) {
          obj.fill = colors[1];
        } else if (x.properties.filmInfo.length < 10) {
          obj.fill = colors[2];
        } else if (x.properties.filmInfo.length < 25) {
          obj.fill = colors[3];
        } else {
          obj.fill = colors[4];
        }
        return obj;
      })
    );
    return lengths;
  }

  async setUpOverView(){
    let overviewInfo = await Promise.all(
      boroughMapInfo.features.map(async (x) => {
        let name = x.properties.name
        let num = this.state.boroughInfo[name].length
        let fill
        if(num < 1000){
          fill = '#ffa500'
        }
        else if(num < 2000){
          fill = '#c98304'
        }
        else if(num < 3000){
          fill = '#a86d03'
        } else {
          fill = '#7f5201'
        }
        return {features: x, name, num, fill }
      })
    )
    return overviewInfo
  }

  setYear(evt){
    this.setState({...this.state, year: evt.target.value})
    this.setBoroughData()
  }

  setView(evt){
    if(evt.target.value === 'overView'){
      this.setState({...this.state, selectedView: this.state.overView})
    }
    if(evt.target.value === 'detail'){
      this.setState({...this.state, selectedView: this.state.stateZips})
    }
    if(evt.target.value === 'Brooklyn'){
      this.setState({...this.state, selectedView: this.state.brooklynZips})
    }
    if(evt.target.value === 'Queens'){
      this.setState({...this.state, selectedView: this.state.queensZips})
    }
    if(evt.target.value === 'Manhattan'){
      this.setState({...this.state, selectedView: this.state.manhattanZips})
    }
    if(evt.target.value === 'Bronx'){
      this.setState({...this.state, selectedView: this.state.bronxZips})
    }
    if(evt.target.value === 'Staten Island'){
      this.setState({...this.state, selectedView: this.state.statenZips})
    }
  }

  async setBoroughData(){
    let brooklynZips = []
    let queensZips = []
    let bronxZips = []
    let statenZips = []
    let manhattanZips = []
    let Brooklyn = await this.getDataBorough('Brooklyn', this.state.year);
    let Queens = await this.getDataBorough('Queens', this.state.year);
    let Bronx = await this.getDataBorough('Bronx', this.state.year);
    let StatenIsland = await this.getDataBorough('Staten Island', this.state.year);
    let Manhattan = await this.getDataBorough('Manhattan', this.state.year);
    let boroughInfo = {
      Brooklyn,
      Queens,
      Bronx,
      StatenIsland,
      Manhattan,
    };


    this.setState({ ...this.state, boroughInfo });
    let allZips = await this.setUpdata();
    let overView = await this.setUpOverView()
    allZips.forEach(x => {
      if(x.features.properties.borough === 'Brooklyn'){
        brooklynZips.push(x)
      }
      if(x.features.properties.borough === 'Queens'){
        queensZips.push(x)
      }
      if(x.features.properties.borough === 'Bronx'){
        bronxZips.push(x)
      }
      if(x.features.properties.borough === 'Staten Island'){
        statenZips.push(x)
      }
      if(x.features.properties.borough === 'Manhattan'){
        manhattanZips.push(x)
      }

    })
    this.setState({ ...this.state, stateZipInfo: zipInfo, stateZips: allZips, overView, selectedView: overView, brooklynZips, queensZips, bronxZips, statenZips, manhattanZips });
  }

  async getDataZip(zip, year) {
    let zipYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&zipcode_s=${zip}`;
    let response = await axios.get(zipYear);
    return response.data;
  }

  componentDidMount() {
    this.setBoroughData()
  }

  async componentDidUpdate(){
  }

  render() {
    console.log('state is ', this.state)
    let display = this.state.selectedView || this.state.overView
    let dataSet = [];
    if (this.state.boroughInfo.Brooklyn) {
      dataSet = [
        this.state.boroughInfo.Brooklyn.length,
        this.state.boroughInfo.Queens.length,
        this.state.boroughInfo.Bronx.length,
        this.state.boroughInfo.StatenIsland.length,
        this.state.boroughInfo.Manhattan.length,
      ];
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2> What's Filming Where?</h2>
          <select onChange={this.setYear}>
            <option value="2018">2018</option>
            <option value="2015">2015</option>
            <option value="2012">2012</option>
          </select>
          <select onChange={this.setView}>
            <option value="overView">Overview</option>
            <option value="Manhattan">Manhattan</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Queens">Queens</option>
            <option value="Bronx">Bronx</option>
            <option value="Staten Island">Staten Island</option>
            <option value="detail">Detail</option>
          </select>
          {/* <BarChart data={dataSet} size={[400, 450]} /> */}
          <NYCMap stateZips={this.state.selectedView}/>
        </div>
      </div>
    );
  }
}

export default App;

//https://data.cityofnewyork.us/resource/tg4x-b46p.json?borough=Queens&subcategoryname=Episodic series
