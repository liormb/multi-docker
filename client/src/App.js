import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// components
import Home from './Home';
import Contact from './Contact';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<h1 className="App-title">Welcome to React</h1>
						<Link to="/">Home</Link>
						<Link to="/contact">Contact</Link>
					</header>
					<div>
						<Route exact path="/" component={Home} />
						<Route path="/contact" component={Contact} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
