import Player from './Player';
import Item from './Item';

const generateNewPlayer = () => {
	return new Player('Test Name', 'Tester', 10, 10, 10, new Item('Test Weapon', 'Test Weapon', 10, 'Weapon', 10, true), 'None');
};

it('loads without crashing', () => {
	generateNewPlayer();
});

it('handles inventory', () => {
	const player = generateNewPlayer();
	player.addItem(new Item('First Item', 'First Item', 10, 'Test Item', 10, true));
	expect(player.getInventoryWeight()).toEqual(10);
	player.deleteItem('Test Item');
	expect(player.getInventoryWeight()).toEqual(0);
});

it('deals damage', () => {
	const player = generateNewPlayer();
	expect(player.dealDamage()).toBeGreaterThanOrEqual(0);
});

it('handles keys', () => {
	const player = generateNewPlayer();
	player.addItem(new Item('First Item', 'First Item', 10, 'Key', 10, true));
	expect(player.hasKey()).toBeTruthy();
});

it('heals no more than maxHealth', () => {
	const player = generateNewPlayer();
	expect(player.health).toBe(10);
	player.heal(10);
	expect(player.health).toBe(10);
});