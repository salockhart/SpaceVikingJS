import React from 'react';
import './App.css';

import ScriptReader from '../Scripts/ScriptReader';
import Scripts from '../Scripts/Scripts';
// import FirstEmailScript from '../Scripts/FirstEmail';
// import NameScript from '../Scripts/Name';

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
			runningIntro: true,
			waitingForSubmit: false,
			canEnter: false,
			canType: false,
			displayPrompt: false,
			isError: false,
			terminal: [],
			input: ''
		};
	}

	componentDidMount() {
		(async () => {
			await this.readScript(Scripts.Opening);
			await this.asyncSetState({
				canEnter: true,
			});
			await this.waitForSubmit();
			await this.clearTerminal();
			await this.asyncSetState({
				canEnter: false,
			});
			await this.readScript(Scripts.NameEmail);
			await this.asyncSetState({
				canEnter: true,
				canType: true,
				displayPrompt: true,
			});
			const name = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
				displayPrompt: false,
			});
			await this.readScript(Scripts.EmailSent);
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.TitleEmail);
			await this.asyncSetState({
				canEnter: true,
				canType: true,
				displayPrompt: true,
			});
			const title = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
				displayPrompt: false,
			});
			await this.readScript(Scripts.EmailSent);
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
		})();
	}

	asyncSetState = (newState) => {
		return new Promise((resolve, reject) => {
			this.setState(newState, resolve);
		});
	}

	readScript = (script) => {
		return new Promise((resolve, reject) => {
			let terminal = this.state.terminal;
			terminal.push({
				stamp: false,
				text: <ScriptReader typingSpeed={5} script={script} onComplete={resolve} />
			});
			this.setState({
				terminal
			});
		});
	}

	clearTerminal = async () => {
		await this.asyncSetState({
			terminal: []
		});
	}

	getPrompt = () => {
		if (!this.state.displayPrompt) {
			return null;
		}
		const color = this.state.isError ? 'red' : 'magenta';
		return (
			<div className={`prompt ${color}`}>
				{PROMPT_SYMBOL}
			</div>
		);
	}

	waitForSubmit = () => {
		return new Promise((resolve, reject) => {
			this.setState({
				waitingForSubmit: resolve
			});
		});
	}

	waitForMilliseconds = (ms) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
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
		if (!this.state.canEnter) {
			return;
		}
		if (event.keyCode === 13) {
			let waitingForSubmit = this.state.waitingForSubmit;
			const terminal = this.state.terminal;
			const input = this.state.input;
			let isError = this.state.isError;
			const args = input.split(' ');
			terminal.push({
				noNewLine: true,
				stamp: true,
				text: <span>{this.getPrompt()}{input}</span>,
			});
			if (!this.state.runningIntro) {
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
			}
			if (waitingForSubmit) {
				waitingForSubmit(input);
				waitingForSubmit = false;
			}
			this.setState({
				waitingForSubmit,
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
			if (idx === 0 || entry.noNewLine) {
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
