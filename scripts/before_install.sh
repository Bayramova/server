#!/bin/bash

# Install node.js
sudo apt-get update
sudo apt-get install -y build-essential openssl libssl-dev pkg-config
sudo apt-get install -y nodejs  
sudo apt-get install npm -y
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

# Install nginx
sudo apt-get install nginx git -y
sudo apt-get install -y build-essential openssl libssl-dev pkg-config
cd /etc/nginx/sites-available
sudo vim server
echo "server {
    listen 80;
    location / {
        proxy_pass http://10.0.0.232:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}" > server
sudo rm default
sudo ln -s /etc/nginx/sites-available/server /etc/nginx/sites-enabled/server
sudo rm /etc/nginx/sites-enabled/default

# Install pm2
sudo npm install pm2 -g

