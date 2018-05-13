#!/bin/bash
cd ~/Oswald
git pull origin master
screen node app.js
node app.js
