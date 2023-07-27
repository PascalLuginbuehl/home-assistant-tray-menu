# Home Assistant Tray Menu
<a href="https://github.com/PascalLuginbuehl/home-assistant-tray-menu/releases" target="_blank"><img src="https://img.shields.io/github/package-json/v/PascalLuginbuehl/home-assistant-tray-menu" alt="Latest release" /></a><br />
Home Assistant integration into the Windows System Tray.

![Home Assistant System Tray Windows 10](https://github.com/PascalLuginbuehl/home-assistant-tray-menu/assets/17087783/824b3e90-b28e-4595-a0d6-fc5611753b9c)
![Home Assistant System Tray Windows 11](https://github.com/PascalLuginbuehl/home-assistant-tray-menu/assets/17087783/fd3bd4bd-07f8-4dc5-bff0-76d9e24d3335)

This enables the user to control Home Assistant entities from within the system tray.
Compared to other similar libraries, this feels like a native Windows menu (similar to the one found in the Sounds tray).

For easy configuration, entities can be added, sorted, and edited using a GUI.

![Settings](https://github.com/PascalLuginbuehl/home-assistant-tray-menu/assets/17087783/0f0b0810-9682-4ea4-80b6-b1b557d89ea0)

# Installation
- Download from the [Releases page](https://github.com/PascalLuginbuehl/home-assistant-tray-menu/releases) and run the installer EXE.
- A "Windows protected your PC" message will pop up, click "More info" and then "Run anyway" This is a precaution from Windows because this application is not signed.
- Once the installation is complete, you should see the Home Assistant icon in your system tray.
- Right-click on the tray icon to open settings

# Stack
- Built using electron-forge and react
- using @mui/material, @tanstack/react-query and react-hook-form
- tray implementation from <https://github.com/xanderfrangos/twinkle-tray>

# Contributing
I appreciate feedback and contributions to this repo!

# Related:
- <https://github.com/codechimp-org/ha-menu>
- <https://github.com/addyire/ha-menu>
- <https://github.com/PiotrMachowski/Home-Assistant-Taskbar-Menu>
- <https://github.com/LAB02-Research/HASS.Agent>

# Build Instructions
If you wish to run a development build of Home Assistant Tray Menu:
- Download or clone.
- Install the build tools for node-gyp, if not already installed. You may already have these from installing NodeJS.
- Run `npm install`.
- Run `npm run make` to build an executable or `npm start` to run actual development.
