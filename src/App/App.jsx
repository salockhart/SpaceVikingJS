import React from 'react';
import './App.css';

import OpeningScript from '../Scripts/Opening';
import FirstEmailScript from '../Scripts/FirstEmail';
import NameScript from '../Scripts/Name';

const commands = {
	'help': 'I help those who help themselves',
	'spaceviking': 'lets go',
};

const PROMPT_SYMBOL = '❯';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			canType: false,
			isError: false,
			terminal: [],
			input: ''
		};
	}

	componentDidMount() {
		this.readScript(OpeningScript);
		this.readScript(FirstEmailScript);
		this.readScript(NameScript);
	}

	readScript = (script) => {
		let terminal = this.state.terminal;
		terminal.push({
			stamp: false,
			text: <span>{script}</span>
		});
		this.setState({
			terminal
		});
	}

	getPrompt = () => {
		const color = this.state.isError ? 'red' : 'magenta';
		return (
			<div className={`prompt ${color}`}>
				{PROMPT_SYMBOL}
			</div>
		);
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
			let isError = this.state.isError;
			const args = input.split(' ');
			terminal.push({
				stamp: true,
				text: <span>{this.getPrompt()}{input}</span>,
			});
			if (args[0] in commands) {
				isError = false;
				terminal.push({
					stamp: true,
					text: commands[args[0]],
				});
			} else if (input !== '') {
				isError = true;
				terminal.push({
					stamp: true,
					text: `'${args[0]}' is not a valid command. Type 'help' for help`,
				});
			}
			this.setState({
				terminal,
				input: '',
				isError,
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
				{this.getPrompt()}
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
