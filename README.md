> Migrated to [gitlab.cobalt.rocks](https://gitlab.cobalt.rocks/cobalt/boardgame)

![Electron Version](https://img.shields.io/badge/electron-9.0.2-blue?style=for-the-badge&logo=electron)

# boardgame

electron powered implementation of pentagame. Powered by https://github.com/Penta-Game/boardgame-backend

## Pentagame notes

The file `src/js/penta-math.js` represents a pentagame board and can compute the sizes etc.

## Installation

A working npm installation (>=6.14.5) is required.

To install all dependencies run:

`npm install`

To run the app:

`npm start`

To get a list of available commands:

`npm run`

## Development Notes

It's recommended to use `tsc-watcher` while working on files in `src`. Otherwise the running instance will only be able to acces the files (JS) in the `dist` folder. To use it execute `npm run-script watch`.

## Roadmap

### 0.2 release

- [ ] backend server (maybe flask)
- [ ] boardgame.io multiplayer (client)

### 0.1 release

- [ ] penatagame board logic (math) (being rebuild at the moment)
- [ ] boardgame.io implementation (client)
