import React, { Component } from 'react';
import './App.css';

class StarrySky extends Component {

	constructor(props) {
		super(props);
		this.stars = [];
	}

	componentDidMount() {
		this.addStars();
		//window.addEventListener('resize', this.addStars())
	}

	componentWillUnount() {
		//window.removeEventListener('resize', this.addStars())
	}

	addStars = () => {
		if (!this.stars.length===0) {this.stars = [];};
		
	  	let width= window.innerWidth;
	 	let height = window.innerHeight;	  

		for ( let i = 0; i < 200; i++) {
		    let randomSize = Math.floor(Math.random() * (6) + 1);
		    let randomTop = Math.floor(Math.random() * (height ) + 1);
		    let randomLeft = Math.floor(Math.random() * (width ) + 1);
		    let randomOpacity = (Math.floor(Math.random() * (10 ) + 5)/10);
		    let randomDuration = (Math.floor(Math.random() * (20 ) + 5)/10);
		    let randomColor = Math.floor(Math.random() * (360 ) + 1);
		    let revOrNot = Math.floor(Math.random() * (2 ) + 1);
		    let rev = 'normal';
		    if (revOrNot === 1) rev = 'reverse';
		    
		    let starsCss = {
		    	backgroundColor: "hsl("+randomColor+",100%,90%)",
		     	top:randomTop+"px",
		     	left:randomLeft+"px",
		     	opacity:randomOpacity,
		     	animationDirection:rev,
		     	width:randomSize+"px",
		     	height:randomSize+"px",
		     	animation: "pulse linear "+randomDuration+"s infinite "+randomOpacity+"s",
		     	borderRadius:"50%",
  				boxShadow:"0 0 20px white",
  				position:"absolute", 
		    } 
		this.stars.push(<p key = {i} style = {starsCss}></p>);
		
	};
}	

	render() {
		
		return(
			<div id="container">
			{this.stars}
			</div>
		)
	}

}
export default StarrySky;