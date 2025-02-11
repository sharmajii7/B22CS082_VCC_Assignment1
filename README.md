# Microservice Deployment Across Virtual Machines

## Overview
This project demonstrates the deployment of a simple microservice-based application across three Virtual Machines (VMs) using VirtualBox. The application consists of:

* A **Node.js backend** hosted on VM1
* A **MongoDB database** hosted on VM2
* A **client testing the backend** using `curl` from VM3

## Architecture

* **VM1**: Hosts the backend (Node.js REST API)
* **VM2**: Hosts the MongoDB database
* **VM3**: Acts as the client, sending requests to the backend and receiving responses

## Prerequisites

1. VirtualBox installed on your system
2. Three VMs running Ubuntu CLI (minimal install)
3. Static IP addresses assigned to each VM

## Steps to Deploy

### 1. Configure the Network

1. Set up an **Internal Network** in VirtualBox for all VMs
2. Assign static IP addresses to the VMs as follows:
   * **VM1**: `192.168.1.101`
   * **VM2**: `192.168.1.102`
   * **VM3**: `192.168.1.103`

### 2. Backend Setup on VM1

1. Install Node.js and `npm`:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

2. Create the backend application:
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install express mongoose pm2
   ```

3. Backend Code (`index.js`):
   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const app = express();

   mongoose.connect('mongodb://192.168.1.102:27017/testdb', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   });

   app.get('/api/hello', async (req, res) => {
     const data = await mongoose.connection.db.collection('test').findOne({});
     res.json({ message: data.message || 'Hello from the backend!' });
   });

   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

4. Start the backend using PM2:
   ```bash
   pm2 start index.js
   ```

### 3. MongoDB Setup on VM2

1. Install MongoDB:
   ```bash
   sudo apt update
   sudo apt install -y mongodb
   ```

2. Allow external connections by editing `/etc/mongod.conf`:
   ```yaml
   bindIp: 0.0.0.0
   ```

   Restart MongoDB:
   ```bash
   sudo systemctl restart mongodb
   ```

3. Insert sample data:
   ```bash
   mongo
   use testdb
   db.test.insertOne({ message: 'Hello from MongoDB!' });
   ```

### 4. Client Testing on VM3

1. Install `curl`:
   ```bash
   sudo apt update
   sudo apt install -y curl
   ```

2. Test the backend by sending a request:
   ```bash
   curl http://192.168.1.101:3000/api/hello
   ```

3. You should receive the following response:
   ```json
   {
     "message": "Hello from MongoDB!"
   }
   ```

## Future Improvements

* Add a frontend application for better interaction
* Deploy the microservices in a containerized environment using Docker
* Scale the system using a load balancer

Feel free to fork and enhance the project!
