# Not-Agar.io

Phaser game that seems to be based on Agar.io but isn't.

Can be connected to the 99bugs LED Tv.

Requires external controllers such as the BLE Touch Berry Controllers or command line application.

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development app:

```bash
npm start
```

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

## Related Repositories

* [Not-Agar.io Backend](https://github.com/BioBoost/not-agar.io-backend) which contains the API project that allows control of this game and allows the Phaser game to render to the display.
* [99-Bugs led display API](https://github.com/BioBoost/99bugs-led-display-api) which contains the LED display API (in rust)
* [Rust Driver 99 Bugs Display](https://github.com/BioBoost/99bugs-led-display-driver) which contains the SPI driver for the Raspberry Pi that communicates with the Mojo FPGA
* [Mojo RGB Led Panel Control](https://github.com/BioBoost/mojo_rgb_led_panel_vhdl) the VHDL project that models the FPGA to drive the LED displays and can be controlled via SPI.