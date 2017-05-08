import Map from '../Map/Map';
import Player from '../Models/Player';

type command = {
	description:string,
	noNewLine:?boolean,
	fn:any,
}

class Commands {

	map:Map;
	player:Player;
	commands:{[string]:command};
	fight:{[string]:command};
	inventory:{[string]:command};

	state:string;

	constructor(map:Map, player:Player) {
		this.state = 'default';
		
		this.map = map;
		this.player = player;

		console.log(this.map);

		this.commands = {
			'map': {
				description: 'open your map (shows only previously visited and adjacent rooms)',
				noNewLine: true,
				fn: this.getMap,
			},
			'inventory': {
				description: 'open inventory',
				fn: this.openInventory,
			},
			'look': {
				description: 'look at your surroundings',
				fn: this.map.look,
			},
			'pick up': {
				description: 'pick up an item',
				fn: () => {},
			},
			'move north': {
				description: 'move to the northern adjacent room (if valid)',
				fn: this.map.moveNorth,
			},
			'move east': {
				description: 'move to the eastern adjacent room (if valid)',
				fn: this.map.moveEast,
			},
			'move west': {
				description: 'move to the western adjacent room (if valid)',
				fn: this.map.moveWest,
			},
			'move south': {
				description: 'move to the southern adjacent room (if valid)',
				fn: this.map.moveSouth,
			},
			'unlock': {
				description: 'unlocks an adjacent locked room',
				fn: () => {},
			},
			'stats': {
				description: 'displays current character stats',
				fn: () => {},
			},
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'spaceviking': {
				description: 'lets go',
				fn: () => {},
			},
		};

		this.fight = {
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'attack': {
				description: 'attack the enemy',
				fn: () => {},
			},
			'run': {
				description: 'flee from the enemy',
				fn: () => {},
			}
		};

		this.inventory = {
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'see': {
				description: 'view the contents of your inventory',
				fn: this.viewInventory,
			},
			'use': {
				description: 'use an item from your inventory',
				fn: () => {},
			},
			'equip': {
				description: 'equip a weapon from your inventory',
				fn: () => {},
			},
			'drop': {
				description: 'drop an item or weapon from your inventory',
				fn: () => {},
			},
			'exit': {
				description: 'leave the inventory',
				fn: this.exitInventory,
			},
		};
	}

	runCommand = (command:string) => {
		let commands = this.commands;
		if (this.state === 'fight') {
			commands = this.fight;
		} else if (this.state === 'inventory') {
			commands = this.inventory;
		}
		if (command in commands) {
			return {
				err: false,
				output: commands[command].fn().map(line => {
					return {
						noNewLine: !!commands[command].noNewLine,
						text: line,
					};
				}),
			};
		} else {
			return {
				err: true,
				output: {
					text: [`'${command}' is not a valid command. Type 'help' for help`],
				},
			};
		}
	}

	getHelp = (isFight:boolean):Array<string> => {
		let commands = this.commands;
		if (this.state === 'fight') {
			commands = this.fight;
		} else if (this.state === 'inventory') {
			commands = this.inventory;
		}
		return Object.keys(commands).map(key => {
			return `${key}: ${commands[key].description}`;
		});
	}

	getMap = () => {
		return this.map.mapString();
	}

	openInventory = () => {
		this.state = 'inventory';
		return ['What will you do with your inventory?'];
	}

	viewInventory = () => {
		if (this.player.inventory.length !== 0) {
			console.log(this.player.inventory);
			let inv = this.player.inventory.map((item, idx) => {
				const desc = [
					`${idx} - ${item.name}`,
					`     ${item.detail}`,
				];
				if (item.type === 'Weapon') {
					desc.push(`     Damage: ${item.dataValue}`);
				}
				return desc;
			});
			inv = [].concat(...inv);
			return inv;
		} else {
			return ['There is nothing to see here.'];
		}
	}

	exitInventory = () => {
		this.state = 'default';
		return ['Exited the inventory'];
	}
}

export default Commands;