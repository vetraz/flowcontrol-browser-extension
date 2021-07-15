const itemClassBase = 'toi-item';
const itemTemplate = `<span class="${itemClassBase}__state"></span><span class="${itemClassBase}__text">{{name}}</span>`;

const defaultScheme = {};

class WCControl {
	constructor(scheme) {
		scheme = scheme || defaultScheme;
		this.initItemList(scheme);
	}

	createItem(itemData) {
		let preparedItemContent = itemTemplate.replace("{{name}}", itemData.name);

		const item = document.createElement("li");
		item.classList.add(itemClassBase);
		item.innerHTML = preparedItemContent;
		return item;
	}

	initItemList(scheme) {
		const sortedKeys = Object.keys(scheme).sort((a, b) => {
			return scheme[a].order - scheme[b].order;
		});

		this.itemsMap = {};
		this.itemsList = sortedKeys.map((key, index) => {
			this.itemsMap[key] = index;
			return this.createItem(scheme[key]);
		});
	}

	updateItemsClasses(data) {
		for (let i in data) {
			let itemkey = this.itemsMap[i];
			if (typeof itemkey === "number") {
				if (data[i].state === "busy") {
					this.itemsList[itemkey].classList.remove("vacant");
					this.itemsList[itemkey].classList.add("occupied");
				} else {
					this.itemsList[itemkey].classList.remove("occupied");
					this.itemsList[itemkey].classList.add("vacant");
				}
			}
		}
	}

	render(data) {
		this.updateItemsClasses(data);

		const listElement = document.createElement("ul");
		listElement.classList.add("toi-items");
		this.itemsList.map(el => listElement.append(el));

		return listElement;
	}

	update(data) {
		this.updateItemsClasses(data);
	}
}

export default WCControl;
