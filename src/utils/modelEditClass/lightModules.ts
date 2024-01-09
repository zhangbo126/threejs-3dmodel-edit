export default class lightModules {
	name2: string;
	prototype: any;
	constructor() {
		this.name2 = 'lightModules'
	}
	onSetLightModules() {
		console.log(this.name2)
	}
}