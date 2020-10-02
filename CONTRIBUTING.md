# Contributing
All contributions are welcome! However, there are some things you need to take note of before starting your contribution to the Mue project.

## General
Test *everything*. That's right - make sure every feature still works depending on the change you just implemented. If it's a translation, check if all strings are translated. 
A bug fix? See if it has fixed the issue fully on both Chromium and Firefox. For features, make sure that everything else still works fine and is compatible with what you
implemented.

### Translations
Please don't use Google Translate. When submitting new translations, we'd prefer it if you waited until it's finished before pull requesting or if you opened it as a draft.

## Development
### Code
Here's some quick bullet points as to what your code should be like on Mue:
* Follow the general codestyle of the project (unless you can make it more optimised)
* Fix any React or JS errors/warnings created
* Use as few external dependencies as possible

### Features
We prefer it if you implement features from our [projects board](https://github.com/mue/mue/projects). However, if you have an idea feel free to let us know first via a GitHub
issue or our Discord server (see README for invite). Here's a quick list of things to look out for:
* External APIs - Please refrain from requesting to servers not on the ``muetab.xyz``, ``derpyenterprises.org`` or ``duckduckgo.com`` domains. Whenever possible, try to create
a "proxy" API service for requests to go through. Pull requests involving paid APIs or heavily limited free plans will be denied.
* Clones - Please don't go blatantly copying features from the alternative extensions out there unless you have written permission from the original author of the project. 
Inspired features are fine.
* Removed Features - If a feature has been removed by us don't add it back again without asking us about it first for the reasons as to why it was removed in the first place.

### Bug Fixes
See the note in general.


## Final Note
Contact us before doing anything if you don't want to have to change 1000 things and/or have your pull request closed.
