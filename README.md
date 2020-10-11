<img src="https://raw.githubusercontent.com/mue/branding/master/logo/logo_round.png" align="left" width="180px" height="180px"/>
<img align="left" width="0" height="192px" hspace="10"/>

> <a href="https://muetab.xyz/">Mue</a>

[![License](https://img.shields.io/badge/license-BSD%203-blue?style=flat-square)](/LICENSE) [![Discord](https://img.shields.io/discord/659129207208804381?label=discord&color=7289DA&style=flat-square)](https://discord.gg/zv8C9F8) [![Code Size]( https://img.shields.io/github/languages/code-size/mue/mue?color=green&label=size&style=flat-square)]()
<br>
[![Microsoft Edge](https://img.shields.io/badge/dynamic/json?style=flat-square&label=microsoft%20edge&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Faepnglgjfokepefimhbnibfjekidhmja)](https://microsoftedge.microsoft.com/addons/detail/aepnglgjfokepefimhbnibfjekidhmja) [![Firefox](https://img.shields.io/amo/v/mue?label=firefox&style=flat-square)](https://addons.mozilla.org/firefox/addon/mue) [![Chrome](https://img.shields.io/chrome-web-store/v/bngmbednanpcfochchhgbkookpiaiaid?label=chrome&style=flat-square)](https://chrome.google.com/webstore/detail/mue/bngmbednanpcfochchhgbkookpiaiaid)

Mue is a fast, open and free-to-use browser extension that gives a new, fresh and customizable tab page to most modern browsers

<br>

## Table of contents
* [Screenshot](#screenshot)
* [Features](#features)
* [Planned Features](#planned-features)
* [Installation](#installation)
	* [Chrome](#chrome)
	* [Firefox](#firefox)
	* [Chromium](#edge-chromium)
	* [Opera/Other](#operaother)
* [Contributing](#development)
	* [Requirements](#requirements)
	* [Starting](#starting)
	* [Building](#building)
* [Credits](#credits)
	* [Maintainers](#maintainers)
	* [Contributors](#contributors)
  * [Translators](#translators)
	* [Other](#other)

## Screenshot
![Screenshot](assets/screenshot.jpg)

## Features
* Fast and free
* Supports multiple browsers
* Actively developed and open source
* Automatically updating API (no tracking) with new photos, quotes and offline mode
* Search bar
* Settings - enable/disable various features and customise parts of Mue
* Update modal, copy button and more!
* Marketplace - download custom photo packs, quote packs, preset settings and themes made by the community!

### Planned Features
Please see our [roadmap](https://github.com/mue/mue/projects/2)

## Installation
*A demo of the tab can be found [here](https://demo.muetab.xyz)*
### Chrome
[![Chrome Web Store Logo](assets/chrome.png)](https://chrome.google.com/webstore/detail/mue/bngmbednanpcfochchhgbkookpiaiaid)
<br>
[Chrome Web Store](https://chrome.google.com/webstore/detail/mue/bngmbednanpcfochchhgbkookpiaiaid)

### Firefox
[![Firefox Add-ons Logo](assets/firefox.png)](https://addons.mozilla.org/firefox/addon/mue)
<br>
[Firefox Add-ons](https://addons.mozilla.org/firefox/addon/mue)

### Edge (Chromium)
[Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/aepnglgjfokepefimhbnibfjekidhmja)

### Opera/Other
[GitHub Releases](https://github.com/mue/mue/releases)

### Development
#### Requirements
<ol>
  <li><a href='https://git-scm.com'>Git</a></li>
  <li><a href='https://nodejs.org'>Node.JS</a></li>
  <li>A suitable browser</li>
</ol>
<h5>Starting</h5>
<ol>
  <li> Clone the repository using <code>git clone https://github.com/mue/mue.git</code>
  <li> Run <code>yarn</code> or <code>npm i</code> to install all needed dependencies
  <li> Run <code>yarn start</code> or <code>npm start</code> to start testing
  <li> Code your heart out! (See the sections below for how to build the extension)
</ol>
<h2>Building</h2>
<details>
  <summary><b>Chrome/Edge (Chromium)</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> or <code>npm run build</code>
    <li> <code>yarn run chrome</code> or <code>npm run chrome</code>
    <li> Visit <code>chrome://extensions</code> in Chrome
    <li> Click <b>Load unpacked</b> (Make sure <b>Developer Mode</b> is on)
    <li> Go to the directory containing the built copy of Mue and click <b>ok</b>
    <li> Enjoy your new tab!
</details>
<details>
  <summary><b>Opera</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> or <code>npm run build</code>
    <li> <code>yarn run opera</code> or <code>npm run opera</code>
    <li> Visit <code>about://extensions</code> in Opera
    <li> Click <b>Load unpacked extension...</b> (Make sure <b>Developer Mode</b> is on)
    <li> Go to the directory containing Mue and click <b>ok</b>
    <li> Enjoy your new tab!
</details>
<details>
  <summary><b>Firefox</b> (Click to expand)</summary>
  <ol>
    <li> <code>yarn run build</code> or <code>npm run build</code>
    <li> <code>yarn run firefox</code> or <code>npm run firefox</code>
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
      <li> <code>yarn run build</code> or <code>npm run build</code>
      <li> Open the <code>index.html</code> in your browser
      <li> Enjoy your new tab!
    </ol>
</details>

## Credits
### Maintainers
[David Ralph (ohlookitsderpy)](https://github.com/ohlookitsderpy) - Founder, Lead development, Photographer <br>
[Alex Sparkes](https://github.com/alexsparkes) - Name, Lead design, Photographer <br>

### Contributors
[Wessel Tip](https://github.com/Wessel) - Development <br>
[Isaac (Eartharoid)](https://github.com/eartharoid) - QA, Development, Photographer <br>

### Translators
[Wessel Tip](https://github.com/Wessel) - Dutch

[Alex Sparkes](https://github.com/alexsparkes) - French

[Anders](https://github.com/FuryingFox) - Norwegian

[MrZillaGold](https://github.com/MrZillaGold) - Russian

### Other
[Pexels](https://pexels.com) - Stock photos used for offline mode

[Opera Forum](https://forums.opera.com/topic/25046/how-to-disable-completely-the-speed-dial/14) - Portions of code to add Opera support

[Google Fonts](https://fonts.google.com) - Lexend Deca and Roboto fonts

And many thanks to [Highholding](https://discord.bio/p/highholding), [Noa Shapira](#), [Roee Lupo](https://github.com/RoeeLupo), [Jeroen](#), [Glasvegas](https://twitter.com/_glasvegas), [Anders](https://github.com/FuryingFox), [Oded Shapira](https://twitter.com/dondishdev), Jacob Tyrrell and [Nikka Lai](#) for letting us use their wonderful photographs
