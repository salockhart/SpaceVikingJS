import React from 'react';
import Map from '../Map/Map';
import Player from '../Models/Player';

type command = {
	description: string,
	noNewLine:?boolean,
	fn: any,
}

const itemIsUsable = item => item.type === 'Potion' || item.type === 'Statue';
const itemIsEquippable = item => item.type === 'Weapon';
const itemIsDroppable = item => true;

class Commands {

	map: Map;
	player: Player;
	commands: { [string]: command };
	fight: { [string]: command };
	inventory: { [string]: command };

	state: string;

	constructor(map: Map, player: Player, endgame, gameover) {
		this.state = 'default';

		this.map = map;
		this.player = player;

		this.endgame = endgame;
		this.gameover = gameover;

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
				fn: this.move(this.map.moveNorth),
			},
			'move east': {
				description: 'move to the eastern adjacent room (if valid)',
				fn: this.move(this.map.moveEast),
			},
			'move west': {
				description: 'move to the western adjacent room (if valid)',
				fn: this.move(this.map.moveWest),
			},
			'move south': {
				description: 'move to the southern adjacent room (if valid)',
				fn: this.move(this.map.moveSouth),
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
				fn: this.attackEnemy,
			},
			'run': {
				description: 'flee from the enemy',
				fn: this.fleeEnemy,
			},
			'stats': {
				description: 'get the stats of the fight',
				fn: this.fightStats,
			},
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
				fn: this.useItem,
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
		let selectionCommand = false;
		if (this.state === 'fight') {
			commands = this.fight;
		} else if (this.state === 'inventory') {
			commands = this.inventory;
		} else if (this.state === 'pickup') {
			selectionCommand = true;
			commands = [{
				description: 'drop item from inventory',
				fn: this.selectItemForPickup,
			}];
		} else if (this.state === 'equip') {
			selectionCommand = true;
			commands = [{
				description: 'equip item from inventory',
				fn: this.selectItemForEquip,
			}];
		} else if (this.state === 'drop') {
			selectionCommand = true;
			commands = [{
				description: 'drop item from inventory',
				fn: this.selectItemForDrop,
			}];
		} else if (this.state === 'use') {
			selectionCommand = true;
			commands = [{
				description: 'use item in inventory',
				fn: this.selectItemForUse,
			}];
		}

		if (selectionCommand) {
			return {
				err: false,
				output: commands[0].fn(command).map(line => {
					return {
						noNewLine: !!commands[0].noNewLine,
						text: line,
					};
				}),
			};
		} else if (command in commands) {
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

	move = (directionFn): Array<string> => {
		return () => {
			const result = directionFn();
			const enemy = this.map.getCurrentRoom().enemy;
			if (enemy) {
				this.state = 'fight';
				result.push(`You have encountered ${enemy.name} ${enemy.profession}`);
			}
			return result;
		};
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
		const equippableItems = this.player.inventory.filter(itemIsEquippable);
		if (equippableItems.length > 0) {
			this.state = 'equip';
			return ['Enter the number of your selection:'].concat(equippableItems.map((item, idx) => {
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

		const equippableItems = this.player.inventory.filter(itemIsEquippable);

		this.state = 'inventory';
		if (index >= equippableItems.length) {
			return ['You do not have that item'];
		} else if (equippableItems[index].type !== 'Weapon') {
			return ['You can only equip weapons, using the numbers above'];
		} else {
			this.player.addItem(this.player.weapon);
			this.player.weapon = equippableItems[index];
			this.player.dropItem(equippableItems[index]);
			return [<span className="blue">{this.player.weapon.toString()} equipped</span>];
		}
	}

	dropItem = () => {
		const droppableItems = this.player.inventory.filter(itemIsDroppable);
		if (droppableItems.length > 0) {
			this.state = 'drop';
			return ['Enter the number of your selection:'].concat(droppableItems.map((item, idx) => {
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

		const droppableItems = this.player.inventory.filter(itemIsDroppable);

		this.state = 'inventory';
		if (index >= droppableItems.length) {
			return ['You do not have that item'];
		} else {
			const item = droppableItems[index];
			this.map.getCurrentRoom().addItem(item);
			this.player.dropItem(droppableItems[index]);
			return [<span className="blue">{item.toString()} dropped</span>];
		}
	}

	useItem = () => {
		const usableItems = this.player.inventory.filter(itemIsUsable);
		if (usableItems.length > 0) {
			this.state = 'use';
			return ['Enter the number of your selection:'].concat(usableItems.map((item, idx) => {
				return `${idx} - ${item.toString()}`;
			}));
		} else {
			return ['There are no items in your inventory'];
		}
	}

	selectItemForUse = (index: number) => {
		if (isNaN(index)) {
			return ['Please enter a number'];
		}

		const usableItems = this.player.inventory.filter(itemIsUsable);

		this.state = 'inventory';
		if (index >= usableItems.length) {
			return ['You do not have that item'];
		} else if (usableItems[index].type === 'Potion') {
			this.player.heal(this.player.maxHealth / 2);
			this.player.dropItem(usableItems[index]);
			return ['You drank the potion and restored some health'];
		} else if (usableItems[index].type === 'Statue') {
			const initialMessage = 'The statue\'s blessings wash over you. You feel uncomfortably moist.';
			const statue = usableItems[index];
			this.player.dropItem(usableItems[index]);
			if (statue.name.includes('Nisk')) {
				this.player.defense += 10;
				this.player.strength += 5;
				return [initialMessage, 'Defense +10 Strength +5'];
			} else if (statue.name.includes('Caeven')) {
				this.player.strength += 15;
				return [initialMessage, 'Strength +15'];
			} else if (statue.name.includes('Lockhaert')) {
				this.player.defense += 10;
				this.player.strength += 5;
				return [initialMessage, 'Defense +10 Strength +5'];
			} else if (statue.name.includes('Traesk')) {
				this.player.maxHealth += 200;
				return [initialMessage, 'Max Health +200'];
			} else if (statue.name.includes('Duenn')) {
				this.player.defense += 5;
				this.player.maxHealth += 100;
				return [initialMessage, 'Defense +5 Max Health +100'];
			}
		}
	}

	attackEnemy = () => {
		const enemy = this.map.getCurrentRoom().enemy;
		const damageDealt = enemy.takeDamage(this.player.dealDamage());
		const damageDealtStr = `You dealt ${damageDealt} damage to your opponent`;

		if (enemy.health <= 0) {
			return this.checkFightStatus([damageDealtStr]);
		}

		const damageTaken = this.player.takeDamage(enemy.dealDamage());
		return this.checkFightStatus([damageDealtStr, `Your opponent dealt ${damageTaken} damage to you`]);
	}

	fleeEnemy = () => {
		return [<span>Oh I'm sorry. Clearly we've been mistaken and are narrating the deeds of a perpetually <span className="yellow">SNIVELING COWARD</span>, as opposed to a powerful <span className="yellow">{this.player.profession}</span> embarking on a <span className="red">VIKING</span> related journey in the cold and unforgiving <span className="cyan">VOID OF SPACE.</span> Would you also like a spiced latte and a foot massage on your way out? Hm? No, I thought not. Now go back and fight.</span>];
	}

	fightStats = () => {
		const enemy = this.map.getCurrentRoom().enemy;
		return this.player.stats().concat([
			'',
			'Enemy:',
			`Health: ${enemy.health}`,
			`Strength: ${enemy.strength}`,
			`Defense: ${enemy.defense}`,
			`Equipped Weapon: ${enemy.weapon.toString()} (Damage: ${enemy.weapon.dataValue})`,
		]);
	}

	checkFightStatus = (notice:Array<string>) => {
		const enemy = this.map.getCurrentRoom().enemy;
		if (enemy.health <= 0) {
			this.map.getCurrentRoom().enemy = null;
			this.state = 'default';
			this.player.heal(0.05 * this.player.maxHealth);
			if (this.map.location === this.map.bossLocation) {
				this.endgame();
			}
			return notice.concat([`You defeated ${enemy.name} ${enemy.profession}`]);
		} else if (this.player.health <= 0) {
			return this.gameover(notice.concat([`You were defeated by ${enemy.name} ${enemy.profession}`]));
		}
		return notice;
	}
}

export default Commands;