// @flow

import React from 'react';
import './App.css';

import ScriptReader from '../Scripts/ScriptReader';
import Scripts from '../Scripts/Scripts';

import Map from '../Map/Map';

const commands = {
	'help': 'I help those who help themselves',
	'spaceviking': 'lets go',
};

const PROMPT_SYMBOL = '❯';

class App extends React.Component {

	map:Map;
	terminal:any;
	terminalInput:any;
	state: {
		runningIntro:boolean,
		waitingForSubmit:any,
		canEnter:boolean,
		canType:boolean,
		isError:boolean,
		terminal:Array<Object>,
		input:string,
	};

	constructor(props:Object) {
		super(props);

		this.map = new Map();

		this.state = {
			runningIntro: true,
			waitingForSubmit: false,
			canEnter: false,
			canType: false,
			isError: false,
			terminal: [],
			input: ''
		};
	}

	componentDidMount() {
		(async () => {
			await this.readScript(Scripts.Opening());
			await this.asyncSetState({
				canEnter: true,
			});
			this.focusOnInputField();
			await this.waitForSubmit();
			await this.clearTerminal();
			await this.asyncSetState({
				canEnter: false,
			});
			await this.readScript(Scripts.Kernel());
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.NameEmail());
			await this.asyncSetState({
				canEnter: true,
				canType: true,
			});
			this.focusOnInputField();
			const name = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
			});
			await this.readScript(Scripts.EmailSent(name));
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.TitleEmail(name));
			await this.asyncSetState({
				canEnter: true,
				canType: true,
			});
			this.focusOnInputField();
			const profession = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
			});
			await this.readScript(Scripts.EmailSent());
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.BeforeMapEmail(name, profession));
			await this.readScript(this.map.mapString(true), true);
			await this.readScript(Scripts.MidMapEmail(name, profession));
			await this.readScript(this.map.mapString(), true);
			await this.readScript(Scripts.AfterMapEmail(name, profession));
			await this.waitForMilliseconds(2000);
			await this.clearTerminal();
			await this.asyncSetState({
				runningIntro: false,
				canEnter: true,
				canType: true,
			});
		})();
	}

	asyncSetState = (newState:Object) => {
		return new Promise((resolve, reject) => {
			this.setState(newState, resolve);
		});
	}

	readScript = (script:Array<any>, stamp:?boolean) => {
		return new Promise((resolve, reject) => {
			let terminal = this.state.terminal;
			terminal.push({
				stamp: false,
				text: stamp ? script : <ScriptReader typingSpeed={0} script={script} onComplete={resolve} />
			});
			this.setState({
				terminal
			}, () => {
				if (stamp) {
					resolve();
				}
			});
		});
	}

	pushToTerminal = async (content:any) => {
		const terminal = this.state.terminal;
		terminal.push(...content);
		await this.asyncSetState({
			terminal
		});
	}

	clearTerminal = async () => {
		await this.asyncSetState({
			terminal: []
		});
	}

	moveTerminalToTop = () => {
		this.terminal.scrollTop = this.terminal.scrollHeight;
	}

	getPrompt = () => {
		if (!this.state.canEnter && !this.state.canType) {
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

	waitForMilliseconds = (ms:number) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	}

	focusOnInputField = () => {
		this.terminalInput.focus();
	}

	handleInput = (event:{target: {value: string}}) => {
		if (!this.state.canType) {
			return;
		}
		this.setState({
			input: event.target.value
		});
	}

	handleSubmit = (event:{keycode: number}) => {
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
				noNewLine: this.state.runningIntro,
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
			}, this.moveTerminalToTop);
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
					disabled={!this.state.canEnter && !this.state.canType}
					ref={e => this.terminalInput = e}
					value={this.state.input}
					onChange={this.handleInput}
					onKeyUp={this.handleSubmit}
					onBlur={this.focusOnInputField} />
			</div>
		);
	}
}

export default App;
