#!/bin/bash

git pull origin master
yum update -y
sudo su
node app.js
