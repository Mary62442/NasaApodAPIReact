import React, { Component } from 'react';
import './App.css';
import classNames from 'classnames';
import {RandomDatesGenerator} from './randomdatesgenerator';
import StarrySky from './starrysky';

class App extends Component {

  constructor(props) {    
    super(props);
    this.timer = {};
    this.state = {apods:[], arrayEnd: false, activeIndex : undefined, explIndex : undefined};
    this.endDate = new Date();
    this.today = new Date();
    this.rd = {};  
    //this.arrayOfDates = [];   
    this.startDate = new Date(); 
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
    let status = {};
    fetch(mainUrl.concat(query), { method: "GET" })
    .then(response => {
      if (response.status >= 400) {
        status = response.status;
        console.log(response.status);
      }
      return response.json();
    })
    .then(apods => {
      if(status !== 500) {
        this.setState({ apods: apods });
      }
      //this.arrayOfDates.shift();      
      else {
        
        this.randomApods();
      }
    });            
    
  };
  handleClick = (index) => {
    this.setState({activeIndex : index});    
  };

  setUndefined = (undef) => {
    this.setState({activeIndex : undef, explIndex: undef});
  };

  explClick = (index) => {
    if (typeof this.state.explIndex === 'undefined') this.setState({explIndex : index});
    else this.setState({explIndex : undefined})
  }

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
        'clicked': this.state.activeIndex === index,
        'item--large': (index === 3 || index === 5),
        'item--medium': ((index % 3) === 0),
        'item--full': (index === 6),
      });    
      let explClasses = classNames({
      'apod-explanation': true,
      'large-explanation': this.state.explIndex === index,        
    });        

      if (apod.media_type === 'video') {

        return (

          <div key = {index} onClick = {this.handleClick.bind(this, index)} className= {apodsClasses}>
            <p>{apod.title}</p>
            <div onClick = {this.explClick.bind(this, index)} className = {explClasses}>
              <p>{apod.explanation}</p>
            </div> 
            <iframe alt = {apod.title} width= "100%" height="90%" src = {apod.url}/>
            
          </div>


        )
      }

      else {

      return (
        <div key = {index} onClick = {this.handleClick.bind(this, index)} className= {apodsClasses}  style= {{backgroundImage:'url(' + apod.url + ')'}}>
          
          <p>{apod.title}</p>  
          <div onClick = {this.explClick.bind(this, index)} className = {explClasses}>
            <p>{apod.date}</p>
            <p>{apod.explanation}</p>
          </div> 
        </div>
      );}
    });

    return (
      <div className="App">
        <StarrySky  />
        <div onClick = {this.setUndefined.bind(this, undefined)} className = {typeof this.state.activeIndex !== 'undefined' ? "dark-veil" : "hide-veil"}></div>
        
        <div className = "headerTitle">
          <p>{this.startDate.toISOString().substring(0, 10)}</p>
          <h1 className="App-title">Apods from Nasa</h1>
          <p>{this.endDate.toISOString().substring(0, 10)}</p>
        </div>
        <div className = "pagination">
        
        <button onClick = {this.prevApods} className = {prevButtonClasses}><i className="fa fa-chevron-circle-left fa-fw" aria-hidden="true"></i> Previous</button>
        <button onClick = {this.nextApods} className = {nextTodayButtonClasses}>Next<i className="fa fa-chevron-circle-right fa-fw" aria-hidden="true"></i></button>
        <button onClick = {this.randomApods} className = "pag-button">Random <i className="fa fa-random fa-fw" aria-hidden="true"></i></button>
        <button onClick = {this.todayApods} className = {nextTodayButtonClasses}>Today <i className="fa fa-clock-o fa-fw" aria-hidden="true"></i> </button>
        </div>
        <div className = "gridcontainer">
          {apods.reverse()}
        </div>
      </div>      
    );
  }
}

export default App;
