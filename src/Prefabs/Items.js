import Item from '../Models/Item';

export default {
	//Create all player items for the game
	playerWeapons: {
		soedekilling: new Item('Soedekilling', 'A lyn-gladius', 8, 'Weapon', 20, true),
		sjoraeningi: new Item('Sjoraeningi', 'A dull lyn-cutlass, more fit for a pirate than a viking', 7, 'Weapon', 30, true),
		vejmon: new Item('Vejmon\'s Edge', 'You can tell by the make of the lyn-saber that this used to belong to your friend, Vejmon. How many others has Odin sent to their deaths before you?', 3, 'Weapon', 40, true),
		bjoernkrammer: new Item('The Bjoernkrammer', 'Solid metal lyn-gauntlets, for punching this ship right back to hell.', 12, 'Weapon', 50, true),
		hestespiser: new Item('Hestespiser', 'A brutal looking axe, although from the stains it looks a tad used.', 14, 'Weapon', 60, true),
		andetaender: new Item('Andetaender', 'A set of lyn-daggers, very useful for throwing at enemies from a distance. Too bad you can\'t throw.', 10, 'Weapon', 70, true),
		solvarmer: new Item('Solvarmer', 'Painted with a crude drawing of a shark, this lyn-flamethrower will pack a punch.', 15, 'Weapon', 80, true),
		fiskefrikadeller: new Item('Fiskefrikadeller', 'A hallowed pair of lyn-nunchuks - be sure to use them wisely.', 16, 'Weapon', 90, true),
		
		// God Mode weapon
		topDog: new Item('Digested Hot Dog of Death', 'This stunning treasure is the most powerful weapon bestowed upon man. Digested by Odin himself!', 0, 'weapon', 1000, true),		
	},

	//Create all generic enemy weapons in the game
	enemyWeapons: {
		lynGladius: new Item('lyn-gladius', '', 0, 'Weapon', 20, false),
		lynCutlass: new Item('lyn-cutlass', '', 0, 'Weapon', 30, false),
		lynSaber: new Item('lyn-saber', '', 0, 'Weapon', 40, false),
		lynGauntlets: new Item('lyn-gauntlets', '', 0, 'Weapon', 50, false),
		lynAxe: new Item('lyn-axe', '', 0, 'Weapon', 60, false),
		lynDagger: new Item('lyn-dagger', '', 0, 'Weapon', 70, false),
		lynFlamethrower: new Item('lyn-flamethrower', '', 0, 'Weapon', 80, false),
		lynNunchuk: new Item('lyn-nunchuk', '', 0, 'Weapon', 90, false),

		//Boss weapon
		lynReactor: new Item('The reactor core.', '', 0, 'Weapon', 100, false),
	},

	keys: {
		rusty: new Item('Rusty Key', 'A rusty, old key that doesn\'t look like its been used recently.', 1, 'Key', 0, true),
		light: new Item('Light Key', 'This key spits out a burst of light, opening any door ahead.', 1, 'Key', 0, true),
		bone: new Item('Bone Key', 'You shudder to think about what this key might be made of...', 1, 'Key', 0, true),
		iron: new Item('Iron Key', 'It may not look pretty, but this key could be the one that leads you to the reactor...', 1, 'Key', 0, true),
		janitor: new Item('Janitor\'s Key', 'Once upon a time, there was a space viking janitor who kept keys on his belt...', 1, 'Key', 0, true),
		bent: new Item('Bent Key', 'This key has seen better days, but it still works.', 1, 'Key', 0, true),
		trophy: new Item('Trophy Key', '"For first place in the Viking Unlocking Doors Championship"', 1, 'Key', 0, true),
	},

	potion: new Item('Health Potion', 'Restores Half of Maximum Health', 1, 'Potion', 1, true),

	palmPilot: new Item('Palm Pilot', 'A rusty old device, useful for communication', 0, 'Key Item', 0, true),

	statues: {
		nisk: new Item('Statue of Nisk', 'The statue fills you with an unknown power; you feel like even more of a Viking. Defense +10 Strength +5', 1, 'Statue', 0, true),
		caeven: new Item('Statue of Caeven', 'The statue fills you with an unknown power, you feel stronger than ever before. Strength +15', 1, 'Statue', 0, true),	
		lockhaert: new Item('State of Lockhaert', 'The statue fills you with an unknown power, you feel better than you just did a second ago. Defense +10 Strength +5', 1, 'Statue', 0, true),
		traesk: new Item('Statue of Traesk', 'The statue fills you with lard, er, an unknown power, you can feel old wounds begin to heal and shut. Health +200', 1, 'Statue', 0, true),
		duenn: new Item('Statue of Duenn', 'The statue fills you with a longing for hats. Defense +5 Health +100', 1, 'Statue', 0, true),
	}
};
