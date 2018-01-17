import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

    console.log(this.state.apods);


    let apods = this.state.apods.map(apod => {
      return (
        <div className="apod">
          <div>{apod.title}</div>
          <div>{apod.explanation}</div>
          <div>
            <img src={apod.url} alt="" width="20%" />{" "}
          </div>
        </div>
      );
    });

    return (
      <div className="App">
        
          <h1 className="App-title">Apods from Nasa</h1>
        
          {apods}
      </div>
    );
  }
}

export default App;
