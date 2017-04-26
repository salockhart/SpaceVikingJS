// @flow
import React from 'react';
import Room from './Room';
import Rooms from '../Prefabs/Rooms';

class Map {
	rooms:Array<Array<?Room>>
	location:[number, number];

	constructor() {
		this.rooms = Rooms;
		this.location = [11, 7];
		this.visitCurrentRoom();
	}

	getRoomAt = (location:[number, number]):?Room => {
		if (location[0] < 0 || location[0] >= this.rooms.length) {
			return null;
		}
		if (location[1] < 0 || location[1] >= this.rooms[location[0]].length) {
			return null;
		}
		return this.rooms[location[0]][location[1]];
	}

	visitCurrentRoom = () => {
		const currentRoom = this.getRoomAt(this.location);
		if (currentRoom) {
			currentRoom.visit();
		}
	}

	moveNorth = () => {
		const location = [this.location[0], this.location[1] - 1];
		this.move(location, 'north');
	}

	moveEast = () => {
		const location = [this.location[0] + 1, this.location[1]];
		this.move(location, 'east');
	}

	moveSouth = () => {
		const location = [this.location[0], this.location[1] + 1];
		this.move(location, 'south');
	}

	moveWest = () => {
		const location = [this.location[0] - 1, this.location[1]];
		this.move(location, 'west');
	}

	move = (location:[number, number], direction:string):string => {
		const room = this.getRoomAt(location);
		if (room && !room.isLocked) {
			this.location = location;
			return `You walk through the ${direction}ern door`;
		} else if (!room) {
			return `There is no door to the ${direction}`;
		} else {
			return `You try to continue, but the ${direction}ern door is locked`;
		}
	}

	look = ():Array<string> => {
		const descriptions = [];
		const currentRoom = this.getRoomAt(this.location);
		if (currentRoom)
			descriptions.push(currentRoom.description);
		if (this.location === [0, 5])
			return descriptions;
		const [northRoom, eastRoom, southRoom, westRoom] = this.getAdjacentRooms();
		if (northRoom){
			if (northRoom.isLocked)
				descriptions.push('There is a locked door to the North');
			else
				descriptions.push('There is a door to the North');
		}
		if (eastRoom){
			if (eastRoom.isLocked)
				descriptions.push('There is a locked door to the East');
			else
				descriptions.push('There is a door to the East');
		}
		if (southRoom){
			if (southRoom.isLocked)
				descriptions.push('There is a locked door to the South');
			else
				descriptions.push('There is a door to the South');
		}
		if (westRoom){
			if (westRoom.isLocked)
				descriptions.push('There is a locked door to the West');
			else
				descriptions.push('There is a door to the West');
		}
		if (currentRoom && currentRoom.items.length !== 0)
			descriptions.push('The room has the following items:' + currentRoom.items.join(' '));
		return descriptions;
	}

	unlock = () => {
		const [northRoom, eastRoom, southRoom, westRoom] = this.getAdjacentRooms();
		if (northRoom) {
			northRoom.unlock();
		}
		if (eastRoom) {
			eastRoom.unlock();
		}
		if (southRoom) {
			southRoom.unlock();
		}
		if (westRoom) {
			westRoom.unlock();
		}
	}

	mapString = (fullMap:?boolean):Array<any> => {
		return this.rooms.map((row, rowIdx) => {
			const rooms = row.map((room, colIdx) => {
				if (room && (fullMap || room.hasVisited || this.isAdjacent(room))) {
					if (rowIdx === this.location[0] && colIdx === this.location[1]) {
						return <span>&#91;&#42;&#93;</span>;
					} else {
						return <span>&#91;&nbsp;&#93;</span>;
					}
				} else {
					return <span>&nbsp;&nbsp;&nbsp;</span>;
				}
			});
			rooms.push(<br />);
			return (
				<span key={rowIdx}>
					{rooms}
				</span>
			);
		});
	}

	getAdjacentRooms = ():[?Room, ?Room, ?Room, ?Room] => {
		const northRoom = this.getRoomAt([this.location[0], this.location[1] - 1]);
		const eastRoom = this.getRoomAt([this.location[0] + 1, this.location[1]]);
		const southRoom = this.getRoomAt([this.location[0], this.location[1] + 1]);
		const westRoom = this.getRoomAt([this.location[0] - 1, this.location[1]]);
		return [northRoom, eastRoom, southRoom, westRoom];
	}

	isAdjacent = (room:Room):boolean => {
		return this.getAdjacentRooms().includes(room);
	}
}

export default Map;