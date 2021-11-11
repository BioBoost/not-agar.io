# Not-Agar.io

Phaser game that seems to be based on Agar.io but isn't.

Can be connected to the 99bugs LED Tv.

Requires external controllers such as the BLE Touch Berry Controllers or command line application.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at `dist/bundle.min.js` along with any other assets you project depended. 

## Notes on Phaser 3

* https://rexrainbow.github.io/phaser3-rex-notes/docs/site/
* https://phaser.discourse.group/t/extending-ellipse-objects/5486

## Webpack Template

Started project from [Webpack template](https://github.com/photonstorm/phaser3-project-template).
