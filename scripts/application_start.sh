#!/bin/bash

# Start the server
export PM2_HOME=/home/ubuntu/.pm2
pm2 delete server
cd /home/ubuntu/server/
pm2 start --name server npm -- start