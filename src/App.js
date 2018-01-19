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
    this.rd = {};  
    //this.arrayOfDates = [];   
    this.startDate = null; 
  };

  getStartDate = (endDate) => {
    this.startDate = this.rd.subDays(endDate, 14);
  };

  randomApods = () => {    
    let randomDatesGen = this.rd.randomDates();
    if (typeof randomDatesGen === 'undefined') {
      randomDatesGen = this.rd.randomDates();      
    }
    else {
      this.startDate = randomDatesGen.startDate;
      this.endDate = randomDatesGen.endDate;
      console.log(this.startDate, this.endDate);
      this.fetchData();
    }
  };

  prevApods = () => {
    this.endDate = this.rd.subDays(this.startDate, 1);
    this.getStartDate(this.endDate); 
    this.fetchData();
  };

  nextApods = () => {    
    this.startDate = this.rd.addDays(this.endDate,1);    
    this.endDate = this.rd.addDays(this.startDate,14);
    console.log(this.startDate,this.endDate);
    this.fetchData();
  };

  todayApods = () => {
    this.endDate = this.today;
    this.getStartDate(this.endDate); 
    this.fetchData();
  };
  

  componentDidMount() {
    this.rd = new RandomDatesGenerator(1996,2018);  
    //this.arrayOfDates = this.rd.rangeDates(20);    
    this.getStartDate(this.endDate);    
    this.fetchData();
    //this.timer = setInterval(this.fetchData, 60000);  

  };

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
      this.setState({ apods: apods });
    });        
    
  };

  render() {

    let nextTodayButtonClasses = classNames({
        'pag-button': true,
        'hide-button': (this.endDate.getTime() >= this.today.getTime()),        
      });

    let prevButtonClasses = classNames({
        'pag-button': true,
        'hide-button': (this.endDate.getTime() <= new Date('1996-01-16')),        
      });



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
          <button onClick = {this.randomApods} className = "pag-button">Random apods</button>
          <button onClick = {this.prevApods} className = {prevButtonClasses}>Previous apods</button>
          <button onClick = {this.nextApods} className = {nextTodayButtonClasses}>Next apods</button>
          <button onClick = {this.todayApods} className = {nextTodayButtonClasses}>Today apods</button>
          <div className = "gridcontainer">
            {apods.reverse()}
          </div>
      </div>
      
    );
  }
}

export default App;
