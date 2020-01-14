![Logo](https://github.com/muetab/branding/raw/master/logo/logo_horizontal.png)

# Mue
Fast, open and free-to-use new tab page for most modern browsers.

## Features
* Fast and free
* Supports multiple browsers
* Actively developed and opensource
* Automatically updating API (with no tracking!) with new photos, quotes and offline mode
* Search bar

## Planned Features
* Settings feature - enable/disable features!
* Update modal, copy button and more!
* Multiple language support

## Installation
Note: A demo of the tab can be found [here](https://mue.now.sh).
### Chrome
[![Chrome Web Store Logo](assets/chrome.png)](https://chrome.google.com/webstore/detail/mue/bngmbednanpcfochchhgbkookpiaiaid)

Link: [Chrome Web Store](https://chrome.google.com/webstore/detail/mue/bngmbednanpcfochchhgbkookpiaiaid)

Development: Read the [Development](#development) section.
### Firefox
[![Firefox Add-ons Logo](assets/firefox.png)](https://addons.mozilla.org/firefox/addon/mue)

Link: [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/mue)

Development: Read the [Development](#development) section.
### Edge (Chromium)
Link: [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/aepnglgjfokepefimhbnibfjekidhmja)
### Opera/Other
Link: [GitHub Releases](https://github.com/ohlookitsderpy/Mue/releases)

Development/Other: Read the [Development](#development) section.
### Development
##### Requirements
<ol>
  <li><a href='https://git-scm.com'>Git</a> (optional)</li>
  <li><a href='https://nodejs.org'>Node.js</a></li>
  <li>A suitable browser</li>
</ol>
<h5>Starting</h5>
<ol>
  <li> <code>git clone https://github.com/muetab/mue</code> (If you don't have Git just go to <b>Clone or
      download</b> and click <b>Download ZIP</b>)
  <li> Open a terminal and run these commands: (in the Mue directory)
  <li> <code>yarn</code> (or <code>npm i</code>)
  <li> <code>yarn start</code> (or <code>npm start</code>)
  <li> Start developing! (See the sections below for how to build the extension)
</ol>
<h2>Building</h5>
<details>
  <summary><b>Chrome/Edge (Chromium)</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> (or <code>npm run build</code>)
    <li> Rename <code>manifest-chrome.json</code> in the "manfiest" folder to <code>manifest.json</code> in "build"
    <li> Visit <code>chrome://extensions</code> in Chrome
    <li> Click <b>Load unpacked</b> (Make sure <b>Developer Mode</b> is on)
    <li> Go to the directory containing the built copy of Mue and click <b>ok</b>
    <li> Enjoy your new tab!
</details>
<details>
  <summary><b>Opera</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> (or <code>npm run build</code>)
    <li> Rename <code>manifest-opera.json</code> in the "manfiest" folder to <code>manifest.json</code> in "build"
    <li> Copy <codebackground-opera.js</code> in the "manifest" folder to "build"
    <li> Visit <code>about://extensions</code> in Opera
    <li> Click <b>Load unpacked extension...</b> (Make sure <b>Developer Mode</b> is on)
    <li> Go to the directory containing Mue and click <b>ok</b>
    <li> Enjoy your new tab!
</details>
<details>
  <summary><b>Firefox</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> (or <code>npm run build</code>)
    <li> Rename <code>manifest-firefox.json</code> in the "manfiest" folder to <code>manifest.json</code> in "build"
    <li> Move <code>manifest/background-opera.js</code> to <code>build/background-opera.js</code>   
    <li> Visit <code>about:debugging#addons</code> in Firefox
    <li> Click <b>Load Temporary Add-on</b>
    <li> Go to the directory containing Mue and click on the <b>manifest.json</b>
    <li> Enjoy your new tab!
  </ol>
</details>
<details>
  <summary><b>Other</b> (Click to expand)</summary>
  <i>Note: To get the full new tab experience, set your browser to open the <code>index.html</code> on startup and tab open!</i>
    <ol>
      <li> <code>yarn run build</code> (or <code>npm run build</code>)
      <li> Open the <code>index.html</code> in your browser
      <li> Enjoy your new tab!
    </ol>
</details>

## Screenshot
*Will be updated if needed*

![Screenshot](assets/screenshot.jpg)

## Credits
### Maintainers
[ohlookitsderpy](https://github.com/ohlookitsderpy) (owner, lead developer)

[TurboMarshmello](https://github.com/TurboMarshmello) (name idea, lead designer)

### Other
[Pexels](https://pexels.com) - Stock photos used for offline mode

[Opera Forum](https://forums.opera.com/topic/25046/how-to-disable-completely-the-speed-dial/14) - Portions of code to add Opera support

[Google Fonts](https://fonts.google.com/specimen/Lexend+Deca) - Lexend Deca font

and all the contributors <3

# License
[BSD-3-Clause](LICENSE)
