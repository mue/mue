![Logo](https://github.com/muetab/branding/raw/master/logo/logo_horizontal.png)

# Mue
[![Discord Badge](https://discordapp.com/api/guilds/336039472250748928/widget.png)](https://discord.gg/HJmmmTB)

Fast, open and free-to-use new tab page for most modern browsers.

## Features
* Fast and free
* Supports multiple browsers
* Actively developed and opensource
* Automatically updating API (with no tracking!) with new photos, quotes and offline mode
* ~~Multiple language support~~
* ~~Settings feature - enable/disable features!~~
* Search bar, ~~update modal, copy button and more!~~

*Mue has been recently rewritten with React and is missing the features that are crossed out*

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
  <summary><b>Chrome</b> (Click to expand)</summary>
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
    <li> Visit <code>about://extensions</code> in Opera
    <li> Click <b>Load unpacked extension...</b> (Make sure <b>Developer Mode</b> is on)
    <li> Go to the directory containing Mue and click <b>ok</b>
    <li> Enjoy your new tab!
</details>
<details>
  <summary><b>Firefox</b> (Click to expand)</summary>
  <i>Note: I'm currently trying to find a better method to do this, but this works for now.</i>
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
[ohlookitsderpy](https://github.com/ohlookitsderpy) (lead dev)

[TurboMarshmello](https://github.com/TurboMarshmello) (name idea, code contributions)

### Other
[Pexels](https://pexels.com) - Stock photos used for offline mode

[Opera Forum](https://forums.opera.com/topic/25046/how-to-disable-completely-the-speed-dial/14) - Portions of code to add Opera support

[Google Fonts](https://fonts.google.com/specimen/Lexend+Deca) - Lexend Deca font

### Translations
[ohlookitsderpy](https://github.com/ohlookitsderpy) - English (Quotes and Messages)

[Yanderella](https://github.com/gbacretin) - Italian (Quotes and Messages)

Pepehound - Spanish (Quotes and Messages)

Candystick - Portuguese (Some Quotes)

[PassTheWessel](https://github.com/PassTheWessel) - Dutch (Messages)

[Yanderella](https://github.com/gbacretin) and [ohlookitsderpy](https://github.com/ohlookitsderpy) - French (Messages)

[untocodes](https://github.com/untocodes) - Finnish and German (Messages)

[dondish](https://github.com/dondish) - Hebrew and Russian (Messages)

[Roee Lupo (MrSheldon)](https://github.com/MrSheldon) - Arabic and Swedish (Messages)

*Feel free to pull request with other translations!*

and all the contributors <3

# License
[BSD-3-Clause](LICENSE)
