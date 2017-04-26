// @flow
class Item {
	name:string;
	detail:string;
	weight:number;
	type:string;
	dataValue:number;
	pickupAble:boolean;

	constructor(name:string, detail:string, weight:number, type:string, dataValue:number, pickupAble:boolean) {
		this.name = name;
		this.detail = detail;
		this.weight = weight;
		this.type = type;
		this.dataValue = dataValue;
		this.pickupAble = pickupAble;
	}

	toString = () => {
		return this.name;
	}
}

export default Item;