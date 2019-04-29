#!/bin/bash

# Install node.js
sudo apt-get update
sudo apt-get install -y build-essential openssl libssl-dev pkg-config
sudo apt-get install -y nodejs nodejs-legacy 
sudo apt-get install npm -y
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

# Install nodemon
sudo npm install nodemon -g

# Install pm2
sudo npm install pm2 -g
pm2 update

