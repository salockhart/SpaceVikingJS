import Person from './Person';
import Item from './Item';

const generateNewPerson = () => {
	return new Person('Test Name', 'Tester', 10, 10, 10, new Item('Test Weapon', 'Test Weapon', 10, 'Weapon', 10, true));
};

it('loads without crashing', () => {
	generateNewPerson();
});

it('takes damage', () => {
	const player = generateNewPerson();
	player.takeDamage(10);
	expect(player.health).toBe(5);
});

it('deals damage', () => {
	const player = generateNewPerson();
	expect(player.dealDamage()).toBeGreaterThanOrEqual(0);
});
