import React, { Component } from 'react';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.lookup = this.lookup.bind(this);
  }

  componentDidMount() {}

  lookup(evt) {
    evt.preventDefault();
    this.props.zips.info.forEach(zip => {
      if (evt.target.zipcode.value === zip.features.properties.postalCode) {
        this.setState({
          ...this.state,
          projects: zip.features.properties.filmInfo,
        });
      }
    });
    console.log(this.state);
  }

  render() {
    console.log('state ', this.state);
    return (
      <div>
        <form onSubmit={this.lookup}>
          <input name="zipcode" placeholder="Zipcode" type="number" />
          <button type="submit">search</button>
        </form>{' '}
        {this.state.projects.length ? (
          <div>
            {this.state.projects.map(project => (
              <div className="projects" key={project.eventid}>
                <div className="desc">
                  <label>Date: </label>
                  <p>{project.enddatetime.slice(0, 10)}</p>
                </div>
                <div className="desc">
                  <label>Category: </label>
                  <p>{project.category}</p>
                </div>
                <div className="desc">
                  <label>Subcategory: </label>
                  <p>{project.subcategoryname}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
        {/* <div>
          {this.selected.map(project => (
            <div key={project.eventid}>{project.eventid}</div>
          ))}
        </div> */}
      </div>
    );
  }
}
