import React, { Component } from 'react';
import './App.css';
import classNames from 'classnames';
import {RandomDatesGenerator} from './randomdatesgenerator';

class App extends Component {

  constructor(props) {    
    super(props);
    this.timer = {};
    this.state = {apods:[], arrayEnd: false};
    this.endDate = new Date();
    this.today = new Date();
    //this.rd = {};  
    //this.arrayOfDates = [];   
    this.startDate = null; 
  }

  subDays = (date, days)=> {
  let result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
  };


  prevApods = () => {
    this.endDate = this.subDays(this.startDate, 1);
    this.startDate = this.subDays(this.endDate, 14);
    this.fetchData();
  }

  nextApods = () => {    
    this.startDate = new RandomDatesGenerator().addDays(this.endDate,1);    
    this.endDate = new RandomDatesGenerator().addDays(this.startDate,14);
    console.log(this.startDate,this.endDate);
    this.fetchData();
  }

  componentDidMount() {
    //this.rd = new RandomDatesGenerator(1996,2018);  
    //this.arrayOfDates = this.rd.rangeDates(20);
    
    this.startDate = this.subDays(this.endDate, 14);    
    this.fetchData();

    //this.timer = setInterval(this.fetchData, 60000);  

  }

  fetchData = () => {      

    //console.log(this.arrayOfDates);
    //let item = this.arrayOfDates[0];
    //this.startDate.toISOString().substring(0, 10);
    
    let encode = encodeURIComponent;
    let mainUrl = "https://api.nasa.gov/planetary/apod";
    let key = {
      api_key:'IDEmxsrJV481UMuno4ML82JwUcgmjkZPf45nW6rC',
      start_date:this.startDate.toISOString().substring(0, 10),
      end_date:this.endDate.toISOString().substring(0, 10),
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
      //this.arrayOfDates.shift();
      //if (this.arrayOfDates.length === 0) clearInterval(this.timer);       
      if(this.endDate.getTime() === this.today.getTime()) this.refs.nextButton.style.display="none";
      else this.refs.nextButton.style.display="inline-block";  
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
          <button onClick = {this.prevApods}>Previous apods</button>
          <button ref="nextButton" onClick = {this.nextApods}>Next apods</button>
          <div className = "gridcontainer">
            {apods.reverse()}
          </div>
      </div>
    );
  }
}

export default App;
