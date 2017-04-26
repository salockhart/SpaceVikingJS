// @flow
import Item from '../Models/Item';
import Person from '../Models/Person';
import Player from '../Models/Player';

class Room {
	isLocked:boolean;
	items:Array<Item>;
	enemy:?Person;
	player:Player;
	description:string;
	hasVisited:boolean;

	constructor(isLocked:boolean, items:Array<Item>, enemy:?Person, description:string) {
		this.isLocked = isLocked;
		this.items = items;
		this.enemy = enemy;
		this.description = description;
		this.hasVisited = false;
	}

	unlock = () => {
		this.isLocked = false;
	}

	visit = () => {
		this.hasVisited = true;
	}

	removeItem = (index:number) => {
		this.items.splice(index, 1);
	}

	addItem = (item:Item) => {
		this.items.push(item);
	}
};

export default Room;