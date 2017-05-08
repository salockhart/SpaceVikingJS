import React from 'react';
import Map from '../Map/Map';
import Player from '../Models/Player';

type command = {
	description: string,
	noNewLine:?boolean,
	fn: any,
}

class Commands {

	map: Map;
	player: Player;
	commands: { [string]: command };
	fight: { [string]: command };
	inventory: { [string]: command };

	state: string;

	constructor(map: Map, player: Player) {
		this.state = 'default';

		this.map = map;
		this.player = player;

		//TODO: on move, check for enemy and enter fight if there is one
		this.commands = {
			'map': {
				description: 'open your map (shows only previously visited and adjacent rooms)',
				noNewLine: true,
				fn: this.map.mapString,
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
				fn: this.pickUpItem,
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
				fn: this.unlockRooms,
			},
			'stats': {
				description: 'displays current character stats',
				fn: this.player.stats,
			},
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'spaceviking': {
				description: 'lets go',
				fn: () => ['lets go'],
			},
		};

		this.fight = {
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'attack': {
				description: 'attack the enemy',
				fn: () => { },	//TODO: add function call for attacking an enemy
			},
			'run': {
				description: 'flee from the enemy',
				fn: () => { },	//TODO: add function call for fleeing from an enemy
			}
		};

		this.inventory = {
			'help': {
				description: 'view this page',
				fn: this.getHelp,
			},
			'look': {
				description: 'view the contents of your inventory',
				fn: this.viewInventory,
			},
			'use': {
				description: 'use an item from your inventory',
				fn: () => { },	//TODO: add function call for using an item, like potion or statue
			},
			'equip': {
				description: 'equip a weapon from your inventory',
				fn: this.equipItem,
			},
			'drop': {
				description: 'drop an item or weapon from your inventory',
				fn: this.dropItem,
			},
			'exit': {
				description: 'leave the inventory',
				fn: this.exitInventory,
			},
		};
	}

	runCommand = (command: string) => {
		let commands = this.commands;
		if (this.state === 'fight') {
			commands = this.fight;
		} else if (this.state === 'inventory') {
			commands = this.inventory;
		} else if (this.state === 'pickup') {
			commands = [{
				description: 'drop item from inventory',
				fn: this.selectItemForPickup,
			}];
		} else if (this.state === 'equip') {
			commands = [{
				description: 'equip item from inventory',
				fn: this.selectItemForEquip,
			}];
		} else if (this.state === 'drop') {
			commands = [{
				description: 'drop item from inventory',
				fn: this.selectItemForDrop,
			}];
		}
		if (command in commands) {
			return {
				err: false,
				output: commands[command].fn(command).map(line => {
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

	getHelp = (isFight: boolean): Array<string> => {
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

	openInventory = () => {
		this.state = 'inventory';
		return ['What will you do with your inventory?'];
	}

	viewInventory = () => {
		if (this.player.inventory.length !== 0) {
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

	unlockRooms = () => {
		if (this.player.hasKey()) {
			this.map.unlock();
			this.player.deleteItem('Key');
			return ['You unlocked any locked doors in the room'];
		} else {
			return ['You have no keys to unlock with'];
		}
	}

	pickUpItem = () => {
		if (this.map.getCurrentRoom().items.length !== 0) {
			this.state = 'pickup';
			return ['Enter the number of your selection:'].concat(this.map.getCurrentRoom().items.map((item, idx) => {
				return `${idx} - ${item.toString()}`;
			}));
		} else {
			return ['There is nothing to pick up.'];
		}
	}

	selectItemForPickup = (index: number) => {
		if (isNaN(index)) {
			return ['Please enter a number'];
		}

		this.state = 'default';
		if (index >= this.map.getCurrentRoom().items.length) {
			return ['There isn\'t that many items in the room'];
		} else {
			const item = this.map.getCurrentRoom().items[index];
			this.player.addItem(item);
			this.map.getCurrentRoom().removeItem(index);
			return [`${item.toString()} picked up`];
		}
	}

	equipItem = () => {
		if (this.player.inventory.find(item => item.type === 'Weapon')) {
			this.state = 'equip';
			return ['Enter the number of your selection:'].concat(this.player.inventory
				.filter(item => item.type === 'Weapon')
				.map((item, idx) => {
					return `${idx} - ${item.toString()}`;
				}));
		} else {
			return ['There are no weapons in your inventory'];
		}
	}

	selectItemForEquip = (index: number) => {
		if (isNaN(index)) {
			return ['Please enter a number'];
		}

		this.state = 'inventory';
		if (index >= this.player.inventory.length) {
			return ['You do not have that item'];
		} else if (this.player.inventory[index].type !== 'Weapon') {
			return ['You can only equip weapons, using the numbers above'];
		} else {
			this.player.addItem(this.player.weapon);
			this.player.weapon = this.player.inventory[index];
			this.player.dropItem(index);
			return [<span className="blue">{this.player.weapon.toString()} equipped</span>];
		}
	}

	dropItem = () => {
		if (this.player.inventory.length !== 0) {
			this.state = 'drop';
			return ['Enter the number of your selection:'].concat(this.player.inventory.map((item, idx) => {
				return `${idx} - ${item.toString()}`;
			}));
		} else {
			return ['There are no items in your inventory'];
		}
	}

	selectItemForDrop = (index: number) => {
		if (isNaN(index)) {
			return ['Please enter a number'];
		}

		this.state = 'inventory';
		if (index >= this.player.inventory.length) {
			return ['You do not have that item'];
		} else {
			const item = this.player.inventory[index];
			this.map.getCurrentRoom().addItem(item);
			this.player.dropItem(index);
			return [<span className="blue">{item.toString()} dropped</span>];
		}
	}
}

export default Commands;