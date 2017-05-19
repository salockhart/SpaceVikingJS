// @flow

import Person from '../Models/Person';
import Items from './Items';

export default {
	easy: () => [
		new Person('Ali', 'The Wicked', 200, 20, 5, Items.enemyWeapons.lynGladius),
		// new Person('Svertingr', 'The Blacksmith', 200, 21, 5, Items.enemyWeapons.lynGladius),
		// new Person('Kiotvi', 'The Warrior', 200, 22, 5, Items.enemyWeapons.lynGladius),
		// new Person('Tofa', 'The Warmaiden', 200, 23, 10, Items.enemyWeapons.lynCutlass),
		// new Person('Thorve', 'The Clan Mother', 200, 24, 10, Items.enemyWeapons.lynCutlass),
		// new Person('Kvistr', 'The Quick', 200, 25, 10, Items.enemyWeapons.lynCutlass),
		// new Person('Thorvidr', 'The Oarman', 200, 26, 15, Items.enemyWeapons.lynCutlass),
		// new Person('Oskar','The Quartermaster', 200, 27, 15, Items.enemyWeapons.lynCutlass),
		// new Person('Karl','The Lackey', 200, 28, 15, Items.enemyWeapons.lynCutlass),
		// new Person('Lars','The Hurried', 200, 29, 20, Items.enemyWeapons.lynGladius),
		// new Person('Egil','The Scholar', 200, 30, 20, Items.enemyWeapons.lynGladius),
	],
	medium: () => [
		new Person('Cynbel', 'The Forgotten', 300, 30, 20, Items.enemyWeapons.lynSaber),
		new Person('Tomas', 'Bjornsson', 300, 32, 25, Items.enemyWeapons.lynSaber),
		new Person('Sindri', 'The Tactician', 300, 34, 25, Items.enemyWeapons.lynSaber),
		new Person('Fi', 'The Piper', 300, 36, 25, Items.enemyWeapons.lynGauntlets),
		new Person('Orjan', 'The Butcher', 300, 38, 30, Items.enemyWeapons.lynGauntlets),
		new Person('Thorbjorn', 'The Invader', 300, 39, 30, Items.enemyWeapons.lynGauntlets),
		new Person('Gry', 'The Farmer', 300, 40, 30, Items.enemyWeapons.lynGauntlets),
	],
	hard: () => [
		new Person('Egil', 'The Woodsman', 400, 40, 35, Items.enemyWeapons.lynAxe),
		new Person('Ylva', 'The Carpenter', 400, 40, 35, Items.enemyWeapons.lynAxe),
		new Person('Gunhild', 'The Shield Bearer', 400, 41, 35, Items.enemyWeapons.lynAxe),
		new Person('Sonja', 'The Priestess', 400, 41, 40, Items.enemyWeapons.lynDagger),
		new Person('Harald', 'The Old', 400, 42, 40, Items.enemyWeapons.lynDagger),
		new Person('Svea', 'The Small', 400, 43, 40, Items.enemyWeapons.lynDagger),
		new Person('Terje', 'The Prince', 400, 44, 45, Items.enemyWeapons.lynDagger),
	],
	tough: () => [
		new Person('Baldr', 'The First', 500, 45, 45, Items.enemyWeapons.lynFlamethrower),
		new Person('Eir', 'The Second', 500, 45, 45, Items.enemyWeapons.lynFlamethrower),
		new Person('Frea', 'The Third', 500, 45, 45, Items.enemyWeapons.lynNunchuk),
		new Person('Hildr', 'The Fourth', 500, 45, 45, Items.enemyWeapons.lynNunchuk),
	],
	boss: () => new Person('R.A.I.D.', 'THE REACTOR ARTIFICIAL INTELLIGENCE DESIGNATE', 600, 50, 50, Items.enemyWeapons.lynReactor),
};
