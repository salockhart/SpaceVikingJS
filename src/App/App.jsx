import React from 'react';
import './App.css';

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
			canType: true,
			terminal: [],
			input: ''
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
			const args = input.split(' ');
			terminal.push({
				stamp: true,
				text: <span><div className="prompt magenta">{PROMPT_SYMBOL}</div>{input}</span>,
			});
			if (args[0] in commands) {
				terminal.push({
					stamp: true,
					text: commands[args[0]],
				});
			} else if (input !== '') {
				terminal.push({
					stamp: true,
					text: `'${args[0]}' is not a valid command. Type 'help' for help`,
				});
			}
			this.setState({
				terminal,
				input: ''
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
				<div className="prompt magenta">{PROMPT_SYMBOL}</div>
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
