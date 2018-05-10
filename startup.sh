#!/bin/bash

git pull origin master
yum update -y
node app.js
