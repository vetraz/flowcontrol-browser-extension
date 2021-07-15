# floWControl - chrome extension

[![Licence][licence-card]][licence-link] [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[licence-card]: https://img.shields.io/badge/License-MIT-blue.svg
[licence-link]: http://opensource.org/licenses/MIT "MIT License"

This extension is used to display actual wc state data recieved from [floWControl server](https://github.com/vetraz/flowcontrol). Built extension is available in [Chrome store](https://chrome.google.com/webstore/detail/flowcontrol/gjgnnpogleklcieniomjfmoiklekedcm).

## Extension settings
* Notification server url
  * example value: `ws://server_address/notifier`
* JSON schema to map server response into visible representation
  * example: 
  ```
  {
    "1": {"order": 1, "name": "WC 1"},
    "2": {"order": 3, "name": "WC 2"},
    "3": {"order": 2, "name": "WC 3"}
  }
  ```
  * key corresponds to wc key from server. Value contains order you want wcs to be displayed in and a custom name for a certain wc to be displayed in extension popup.

## Development
### Starting development:
* Install [Yarn](https://yarnpkg.com) in scope global. 
  * `$ npm install -g yarn`
* Install dependencies.
  * `$ cd flowcontrol-browser-extension/ && yarn`
* Start project - Watch files in project and rebuild if any file changed.
  * `yarn start`
* Build for production
  * `yarn build`

### Installing developers version (Chrome)
1. Visit `chrome://extensions/` in Chrome;
2. Enable the **Developer mode**;
3. Click on **Load unpacked extension**;
4. Select the folder `flowcontrol-browser-extension/extension` or the folder name you changed.
