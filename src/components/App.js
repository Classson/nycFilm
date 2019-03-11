import React, { Component } from 'react';
import '../App.css';
import NYCMap from './NYCMap';
import Chart from './Chart';
import Search from './Search';
import zipInfo from '../zipInfo';
import boroughMapInfo from '../boroughInfo';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      boroughInfo: [],
      stateZips: { info: [], scale: 0, center: [], filmType: [] },
      year: '2018',
      overView: { info: [], scale: 0, center: [], name: 'selected' },
      selectedView: { info: [], scale: 0, center: [], name: '' },
      manhattanInfo: { info: [], scale: 0, center: [], name: 'manhattan' },
      brooklynInfo: { info: [], scale: 0, center: [], name: 'brooklyn' },
      queensInfo: { info: [], scale: 0, center: [], name: 'queens' },
      bronxInfo: { info: [], scale: 0, center: [], name: 'bronx' },
      statenInfo: { info: [], scale: 0, center: [], name: 'staten' },
      colors: [
        '#dbdbdb',
        '#ffa500',
        '#c98304',
        '#a86d03',
        '#7f5201',
        '#523501',
        '#422A01',
      ],
    };
    this.getDataBorough = this.getDataBorough.bind(this);
    this.getDataZip = this.getDataZip.bind(this);
    this.setUpdata = this.setUpdata.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setView = this.setView.bind(this);
    this.setUpOverView = this.setUpOverView.bind(this);
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
        let obj = {};
        obj.features = x;
        obj.info = x.properties.filmInfo;
        obj.length = x.properties.filmInfo.length;
        if (x.properties.filmInfo.length === 0) {
          obj.fill = this.state.colors[0];
        } else if (x.properties.filmInfo.length < 5) {
          obj.fill = this.state.colors[1];
        } else if (x.properties.filmInfo.length < 10) {
          obj.fill = this.state.colors[2];
        } else if (x.properties.filmInfo.length < 15) {
          obj.fill = this.state.colors[3];
        } else if (x.properties.filmInfo.length < 20) {
          obj.fill = this.state.colors[4];
        } else if (x.properties.filmInfo.length < 25) {
          obj.fill = this.state.colors[5];
        } else {
          obj.fill = this.state.colors[6];
        }
        return obj;
      })
    );
    return lengths;
  }

  async setUpOverView() {
    let overviewInfo = await Promise.all(
      boroughMapInfo.features.map(async x => {
        let name = x.properties.name;
        let num = this.state.boroughInfo[name].length;
        let fill;
        if (num < 1000) {
          fill = this.state.colors[1];
        } else if (num < 2000) {
          fill = this.state.colors[2];
        } else if (num < 3000) {
          fill = this.state.colors[3];
        } else {
          fill = this.state.colors[4];
        }
        return { features: x, name, num, fill };
      })
    );
    return overviewInfo;
  }

  setYear(evt) {
    this.setState({ ...this.state, year: evt.target.value });

    console.log('selectedView ', this.state.selectedView.name)
    this.setBoroughData(this.state.selectedView.name);
  }

  setView(evt) {
    if (evt.target.value === 'overView') {
      this.setState({ ...this.state, selectedView: this.state.overView });
    }
    if (evt.target.value === 'detail') {
      this.setState({ ...this.state, selectedView: this.state.stateZips });
    }
    if (evt.target.value === 'Brooklyn') {
      this.setState({ ...this.state, selectedView: this.state.brooklynInfo });
    }
    if (evt.target.value === 'Queens') {
      this.setState({ ...this.state, selectedView: this.state.queensInfo });
    }
    if (evt.target.value === 'Manhattan') {
      this.setState({ ...this.state, selectedView: this.state.manhattanInfo });
    }
    if (evt.target.value === 'Bronx') {
      this.setState({ ...this.state, selectedView: this.state.bronxInfo });
    }
    if (evt.target.value === 'Staten Island') {
      this.setState({ ...this.state, selectedView: this.state.statenInfo });
    }
  }

  async setBoroughData(view = 'overview') {
    let brooklynZips = [];
    let queensZips = [];
    let bronxZips = [];
    let statenZips = [];
    let manhattanZips = [];
    let Brooklyn = await this.getDataBorough('Brooklyn', this.state.year);
    let Queens = await this.getDataBorough('Queens', this.state.year);
    let Bronx = await this.getDataBorough('Bronx', this.state.year);
    let StatenIsland = await this.getDataBorough(
      'Staten Island',
      this.state.year
    );
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
    let overInfo = await this.setUpOverView();
    allZips.forEach(x => {
      if (x.features.properties.borough === 'Brooklyn') {
        brooklynZips.push(x);
      }
      if (x.features.properties.borough === 'Queens') {
        queensZips.push(x);
      }
      if (x.features.properties.borough === 'Bronx') {
        bronxZips.push(x);
      }
      if (x.features.properties.borough === 'Staten Island') {
        statenZips.push(x);
      }
      if (x.features.properties.borough === 'Manhattan') {
        manhattanZips.push(x);
      }
    });

    let overView = { info: overInfo, scale: 50000, center: [-73.98, 40.71], name: 'overview' };
    let brooklynInfo = {
      info: brooklynZips,
      scale: 120001,
      center: [-73.9442, 40.65],
      name: 'brooklyn'
    };
    let queensInfo = {
      info: queensZips,
      scale: 70000,
      center: [-73.85, 40.67],
      name: 'queens'
    };
    let manhattanInfo = {
      info: manhattanZips,
      scale: 100000,
      center: [-73.95, 40.78],
      name: 'manhattan'
    };
    let bronxInfo = { info: bronxZips, scale: 120000, center: [-73.85, 40.85] };
    let statenInfo = {
      info: statenZips,
      scale: 110000,
      center: [-74.14, 40.58],
      name: 'staten'
    };
    let detailInfo = { info: allZips, scale: 50000, center: [-73.98, 40.71], name: 'detail' };
    console.log('new view is ', view)
    this.setState({
      ...this.state,
      stateZipInfo: zipInfo,
      stateZips: detailInfo,
      overView,
      //this is where things are fucking up
      // selectedView: overView,
      brooklynInfo,
      queensInfo,
      bronxInfo,
      statenInfo,
      manhattanInfo,
    });
    if(view === 'overview'){
      this.setState({...this.state, selectedView: overView})
    }
    if(view === 'manhattan'){
      this.setState({...this.state, selectedView: manhattanInfo})
    }
    if(view === 'brooklyn'){
      this.setState({...this.state, selectedView: brooklynInfo})
    }
    if(view === 'queens'){
      this.setState({...this.state, selectedView: queensInfo})
    }
    if(view === 'bronx'){
      this.setState({...this.state, selectedView: bronxInfo})
    }
    if(view === 'staten'){
      this.setState({...this.state, selectedView: statenInfo})
    }
    if(view === 'detail'){
      this.setState({...this.state, selectedView: detailInfo})
    }
  }

  async getDataZip(zip, year) {
    let zipYear = `https://data.cityofnewyork.us/resource/tg4x-b46p.json?$where=date_extract_y(enddatetime)%20=%20${year}&zipcode_s=${zip}`;
    let response = await axios.get(zipYear);
    return response.data;
  }

  componentDidMount() {
    this.setBoroughData();
  }

  render() {
    console.log('overall state ', this.state)
    // let display = this.state.selectedView || this.state.overView;
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
          <h1> What's Filming Where?</h1>
          <div className="selects">
            <div className="selecter">
              <label>Year</label>
              <select onChange={this.setYear}>
                <option value="2018">2018</option>
                <option value="2015">2015</option>
                <option value="2012">2012</option>
              </select>
            </div>
            <div className="selecter">
              <label>View</label>
              <select onChange={this.setView}>
                <option value="overView">Overview</option>
                <option value="Bronx">Bronx</option>
                <option value="Brooklyn">Brooklyn</option>
                <option value="Manhattan">Manhattan</option>
                <option value="Queens">Queens</option>
                <option value="Staten Island">Staten Island</option>
                <option value="detail">Detail</option>
              </select>
            </div>
          </div>

          <div className="mapContainer">
            <NYCMap
              stateZips={this.state.selectedView}
              colors={this.state.colors}
            />
          </div>
          <div className="App-chart-container">
            <Chart film={this.state.selectedView} />
          </div>
          <div className="App-chart-container">
            <Search zips={this.state.stateZips} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

