import Item from './Item';

const generateNewItem = () => {
	return new Item('Test Weapon', 'Test Weapon', 10, 'Weapon', 10, true);
};

it('loads without crashing', () => {
	generateNewItem();
});