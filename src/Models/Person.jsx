// @flow
import React from 'react';
import Item from './Item';

class Person {
	name:string;
	profession:string;
	health:number;
	strength:number;
	defense:number;
	weapon:Item;

	constructor(name:string, profession:string, health:number, strength:number, defense:number, weapon:Item) {
		this.name = name;
		this.profession = profession;
		this.health = health;
		this.strength = strength;
		this.defense = defense;
		this.weapon = weapon;
	}

	takeDamage = (damage:number):number => {
		const damageTaken = Math.max(damage - (0.5 * this.defense), 0);
		this.health = this.health - damageTaken;
		return Math.round(damageTaken);
	}

	dealDamage = ():number => {
		const factor = Math.random() * 5;
		const damage = Math.round(this.weapon.dataValue + factor*(0.8*this.strength) + 25*Math.log(0.25*this.strength));
		return damage;
	}

	toHTML = () => {
		return (
			<span>
				Status:<br />
				Health:&#160;&#160;&#160;&#160;&#160;{this.health}<br />
				Strength:&#160;&#160;&#160;&#160;&#160;{this.strength}<br />
				Defense:&#160;&#160;&#160;&#160;&#160;{this.defense}<br />
				Weapon:&#160;&#160;&#160;&#160;&#160;{this.weapon.name}
			</span>
		);
	}
}

export default Person;