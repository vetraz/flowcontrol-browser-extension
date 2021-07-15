import { storage } from 'utils/Storage.js';

class Background {
	constructor() {
		this.wcStates = {};

		this.getStorageNotificationURL(this.wsConnect.bind(this));

		browser.runtime.onMessage.addListener(this.processMessage.bind(this));
	}

	getStorageNotificationURL(callback) {
		storage.get({
			notificationURL: ''
		}).then((data) => {
			this.notificationURL = data.notificationURL;
			if (typeof callback == 'function') {
				callback();
			}
		});
	}

	processMessage(msg, sender) {
		if (msg.from === 'popup') {
			if (msg.subject === 'restart') {
				this.wsRestart();
			}

			if (msg.subject === 'getWCStates') {
				return new Promise(resolve => resolve(this.wcStates));
			}
		}

		if (msg.from === 'settings') {
			if (msg.subject === 'restart') {
				this.wsRestart();
			}
		}
	}

	wsRestart() {
		if (this.ws) {
			clearTimeout(this.retryTimeout);
			this.ws.close(3001); // Status reference https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent /analogy to 1001 but can be used as you wish
		}

		this.wcStates = {};
		this.getStorageNotificationURL(this.wsConnect.bind(this));
	}

	wsConnect() {
		if (this.notificationURL) {
			this.ws = new WebSocket(this.notificationURL);

			this.ws.onmessage = function (event) {
				let response = JSON.parse(event.data);
				this.wsResponseHandler(response);
			}.bind(this);

			this.ws.onclose = function (event) {
				if (event.code !== 3001) { // Status reference https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent /analogy to 1001 but can be used as you wish
					this.retryTimeout = setTimeout(function () {
						this.wsConnect();
					}.bind(this), 5000);
				}
			}.bind(this);

			this.ws.onerror = function (event) {
				this.ws.close();
			}.bind(this);
		}
	}

	wsResponseHandler(response) {
		this.wcStates = response;
		this.anounceWCState();
	}

	anounceWCState() {
		browser.runtime.sendMessage({
			from: 'background',
			subject: 'newWCStates',
			data: this.wcStates
		}).then(() => { }, () => { });
	}
}

export const main = new Background();
