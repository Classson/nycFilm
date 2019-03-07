import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart';
import NYCMap from './NYCMap'

class App extends Component {
  render() {
    let dataSet = [75, 10, 13, 90, 30]
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
