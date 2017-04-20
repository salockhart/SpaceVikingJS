import React from 'react';
import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			canType: true,
			terminal: [],
			input: ""
		};
	}

	handleInput(event) {
		if (!this.state.canType) {
			return;
		}
		this.setState({
			input: event.target.value
		});
	}

	handleSubmit(event) {
		if (!this.state.canType) {
			return;
		}
		if (event.keyCode === 13) {
			const terminal = this.state.terminal;
			const input = this.state.input;
			terminal.push({
				stamp: true,
				text: input
			});
			this.setState({
				terminal,
				input: ""
			}, () => {
				this.terminal.scrollTop = this.terminal.scrollHeight;				
			});
		}
	}

	render() {
		const terminalText = this.state.terminal.map((entry, idx) => {
			const terminalLine = <span>{entry.text}</span>;
			if (idx === 0) {
				return [terminalLine];
			}
			return [<br />, terminalLine];
		});
		return (
			<div
				className="terminal"
				ref={e => this.terminal = e}>
				<div className="output">{terminalText}</div>
				<input
					className="input"
					type="text"
					autoFocus
					ref={e => this.terminalInput = e}
					value={this.state.input}
					onChange={this.handleInput}
					onKeyUp={this.handleSubmit}
					onBlur={() => this.terminalInput.focus()} />
			</div>
		);
	}
}

export default App;
