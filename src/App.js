import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import classNames from 'classnames';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {apods:[]}
  }

  componentDidMount() {
    let encode = encodeURIComponent;
    let mainUrl = "https://api.nasa.gov/planetary/apod";
    let key = {
      api_key:'IDEmxsrJV481UMuno4ML82JwUcgmjkZPf45nW6rC',
      start_date:'2018-01-02',
      end_date:'2018-01-17',
    };     
    let query = `?${Object.keys(key).map(k => `${encode(k)}=${encode(key[k])}`).join('&')}`;
    console.log(mainUrl.concat(query));

    fetch(mainUrl.concat(query), { method: "GET" })
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(apods => {
        this.setState({ apods: apods });

      });
  }

  render() {
    let apods = this.state.apods.map((apod, index) => {
    let apodsClasses = classNames({
      'item': true,
      'item--large': ((index % 6) === 0),
      'item--medium': ((index % 3) === 0),
      'item--full': (index === 4),
    });
      
      return (
        <div key = {index} className= {apodsClasses}  style= {{backgroundImage:'url(' + apod.url + ')'}}>
          <p>{apod.title} {index}</p>   
        </div>
      );
    });

    return (
      <div className="App">
          <h1 className="App-title">Apods from Nasa</h1>
          <div className = "gridcontainer">
            {apods}
          </div>
      </div>
    );
  }
}

export default App;
