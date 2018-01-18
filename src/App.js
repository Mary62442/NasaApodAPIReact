import React, { Component } from 'react';
import './App.css';
import classNames from 'classnames';
import {RandomDatesGenerator} from './randomdatesgenerator';

class App extends Component {

  constructor(props) {
    
    super(props);
    this.timer = {};
    this.state = {apods:[], arrayEnd: false};
    this.date = new Date();
    this.rd = {};  
    this.arrayOfDates = [];
    
  }

  componentDidMount() {
    this.rd = new RandomDatesGenerator(1996,2018);  
    this.arrayOfDates = this.rd.rangeDates(20);

    this.fetchData();
    this.timer = setInterval(this.fetchData, 60000);

   

  }

  fetchData = () => {      

      console.log(this.arrayOfDates);
      let item = this.arrayOfDates[0];

      let encode = encodeURIComponent;
      let mainUrl = "https://api.nasa.gov/planetary/apod";
      let key = {
        api_key:'IDEmxsrJV481UMuno4ML82JwUcgmjkZPf45nW6rC',
        start_date:item.startDate,
        end_date:item.endDate,
      };     
      let query = `?${Object.keys(key).map(k => `${encode(k)}=${encode(key[k])}`).join('&')}`;
      

      fetch(mainUrl.concat(query), { method: "GET" })
        .then(response => {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(apods => {
          this.arrayOfDates.shift();
          if (this.arrayOfDates.length === 0) clearInterval(this.timer);       
          
          this.setState({ apods: apods });
        });        
      
    }

  render() {
    let apods = this.state.apods.map((apod, index) => {

    let apodsClasses = classNames({
      'item': true,
      'item--large': (index === 3 || index === 5),
      'item--medium': ((index % 3) === 0),
      'item--full': (index === 6),
    });
      
      return (
        <div key = {index} className= {apodsClasses}  style= {{backgroundImage:'url(' + apod.url + ')'}}>
          <p>{apod.title}</p>   
        </div>
      );
    });

    return (
      <div className="App">
          <h1 className="App-title">Apods from Nasa</h1>
          <div className = "gridcontainer">
            {apods.reverse()}
          </div>
      </div>
    );
  }
}

export default App;
