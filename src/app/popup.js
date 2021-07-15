import { selector } from 'utils/Selector.js';
import { runtime } from 'utils/Runtime.js';
import { storage } from 'utils/Storage.js';

import WCControl from './entities/WCControl.js';

import 'styles/popup.less';

class Popup {
  constructor() {
    this.firstRender = true;

    selector(document).ready(this.bind());

    //Get schema from saved preferences
    storage.get({
      notificationMapperScheme: ''
    }).then((data) => {
      if (data.notificationMapperScheme) {
        this.wcControl = new WCControl(JSON.parse(data.notificationMapperScheme));
        this.initBrowserEventListeners();
      } else {
        this.showMisconfigurationMessage();
      }
    });
  }

  bind() {
    /**
     * Open options dropown list.
     */
    selector('.open-options').click(() => {
      // Toggle options list with 'show' class.
      selector('.menu-options').toggle('show');
    });

    /**
     * Open the settings page.
     */
    selector('.open-settings').click(() => {
      if (runtime.api('runtime').openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        runtime.api('runtime').openOptionsPage();
      } else {
        // Reasonable fallback.
        window.open(runtime.api('runtime').getURL('options.html'));
      }
    });
  }

  showMisconfigurationMessage() {
    const element = document.createElement('div');
    element.classList.add('misconfigurationMessage');
    element.innerText = 'Display schema is not found. Please, go to settings page and specify apropriate setup.';
    document.getElementById('generated-content').append(element);
  }

  initBrowserEventListeners() {
    browser.runtime.sendMessage({
      from: 'popup',
      subject: 'getWCStates'
    }).then(this.responseHandler.bind(this), console.warn);

    browser.runtime.onMessage.addListener(this.processMessage.bind(this));
  }

  responseHandler(response) {
    if (this.firstRender) {
      let element = this.wcControl.render(response);
      document.getElementById('generated-content').append(element);
    } else {
      this.wcControl.update(response);
    }

    this.firstRender = false;
  }

  processMessage(msg, sender) {
    if (msg.from === 'background') {
      if (msg.subject === 'newWCStates') {
        this.responseHandler(msg.data);
      }
    }
  }
}

export const popup = new Popup();
