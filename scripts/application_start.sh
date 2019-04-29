#!/bin/bash

# Stop all servers and start the server
pm2 stop
pm2 start /home/ubuntu/nodejs/server.js