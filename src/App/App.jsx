// @flow

import React from 'react';
import './App.css';

import ScriptReader from '../Scripts/ScriptReader';
import Scripts from '../Scripts/Scripts';

import Map from '../Map/Map';
import Commands from '../Commands/Commands';
import Player from '../Models/Player';
import Items from '../Prefabs/Items';

const PROMPT_SYMBOL = '❯';

class App extends React.Component {

	map:Map;
	commands:Commands;
	player:Player;
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
		this.player = new Player('Niclas', 'Godking', 400, 25, 25, Items.playerWeapons.soedekilling, null);
		this.player.inventory.push(Items.palmPilot);
		this.commands = new Commands(this.map, this.player, this.endgame);

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
		// this.startgame();
		this.endgame();
	}

	startgame = async () => {
		if (!process.env.REACT_APP_SKIP) {
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
			this.player.name = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
			});
			await this.readScript(Scripts.EmailSent(this.player.name));
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.TitleEmail(this.player.name));
			await this.asyncSetState({
				canEnter: true,
				canType: true,
			});
			this.focusOnInputField();
			this.player.profession = await this.waitForSubmit();
			await this.asyncSetState({
				canEnter: false,
				canType: false,
			});
			await this.readScript(Scripts.EmailSent());
			await this.waitForMilliseconds(1000);
			await this.clearTerminal();
			await this.readScript(Scripts.BeforeMapEmail(this.player.name, this.player.profession));
			await this.readScript(this.map.mapString(true), true);
			await this.readScript(Scripts.MidMapEmail(this.player.name, this.player.profession));
			await this.readScript(this.map.mapString(), true);
			await this.readScript(Scripts.AfterMapEmail(this.player.name, this.player.profession));
			await this.waitForMilliseconds(2000);
			await this.clearTerminal();
		}
		await this.asyncSetState({
			runningIntro: false,
			canEnter: true,
			canType: true,
		});
		this.focusOnInputField();
	}

	endgame = async () => {
		await this.asyncSetState({
			runningIntro: true,
			canEnter: false,
			canType: false,
		});
		await this.readScript(Scripts.Endgame());
		await this.waitForMilliseconds(10000);
		await this.clearTerminal();
		await this.readScript(Scripts.FinalStatus());
		await this.waitForMilliseconds(4000);
		await this.clearTerminal();
		await this.readScript(Scripts.FinalEmail());
		await this.waitForMilliseconds(4000);
		await this.clearTerminal();
		await this.readScript(Scripts.Death());
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
			let terminal = this.state.terminal;
			const input = this.state.input;
			let isError = this.state.isError;
			terminal.push({
				stamp: true,
				text: <span>{this.getPrompt()}{input}</span>,
			});
			if (!this.state.runningIntro) {
				const {err, output} = this.commands.runCommand(input);
				if (!err || input !== '') {
					isError = err;
					terminal = terminal.concat(output);
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
			if (entry.noNewLine) {
				return [terminalLine];
			}
			return [terminalLine, <br />];
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
