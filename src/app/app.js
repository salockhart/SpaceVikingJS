import React from 'react';
import TypeWriter from 'react-typewriter';
import './App.scss';

class App extends React.Component {

	render() {
		return (
			<TypeWriter typing={1}>Hello World! Welcome to Space Viking</TypeWriter>
		);
	}
}

export default App;