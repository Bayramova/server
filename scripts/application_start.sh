#!/bin/bash

# Stop all servers and start the server
pm2 stop
pm2 start /home/ubuntu/server/server.js

# Restart nginx
sudo service nginx stop && sudo service nginx start