// @flow
import Person from './Person';
import Item from './Item';

class Player extends Person {
	inventory:Array<Item>;
	saint:?string;
	maxHealth:number;

	constructor(name:string, profession:string, health:number, strength:number, defense:number, weapon:Item, saint:?string) {
		super(name, profession, health, strength, defense, weapon);
		this.saint = saint;
		this.inventory = [];
		this.maxHealth = health;
	}

	getInventoryWeight = ():number => {
		return Math.max(this.inventory
			.map(item => item.weight)
			.reduce((a,b) => a+b, 0), 1);
	}

	heal = (health:number) => {
		this.health = Math.round(Math.min(this.maxHealth, this.health + health));
	}

	dropItemAtIndex = (index:number) => {
		this.inventory.splice(index, 1);
	}

	dropItem = (item:Item) => {
		this.dropItemAtIndex(this.inventory.findIndex(entry => entry.type === item.type && entry.name === item.name));
	}

	addItem = (item:Item) => {
		this.inventory.push(item);
	}

	hasKey = ():boolean => {
		return !!this.inventory.find(item => item.type === 'Key');
	}

	deleteItem = (type:string) => {
		const index = this.inventory.findIndex(item => item.type === type);
		if (index > -1) {
			this.dropItemAtIndex(index);
		}
	}

	dealDamage = ():number => {
		const factor = Math.random() * 5;
		const damage = Math.round(this.weapon.dataValue + factor*this.strength + 25*Math.log(this.strength/this.getInventoryWeight()));
		console.log({factor, damage, weapon: this.weapon.dataValue});
		return damage;
	}

	stats = ():Array<string> => {
		return [
			`Health: ${this.health}/${this.maxHealth}`,
			`Strength: ${this.strength}`,
			`Defense: ${this.defense}`,
			`Inventory Weight: ${this.getInventoryWeight()}/${this.strength}`,
			`Equipped Weapon: ${this.weapon.toString()} (Damage: ${this.weapon.dataValue})`,
		];
	}
}

export default Player;