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

### 1. Configure the Network (Set Up a NAT Network in VirtualBox for All VMs)

To enable communication between the VMs, we will configure a NAT Network in VirtualBox. Below are the steps to set it up:

#### 1. Create a NAT Network in VirtualBox
1. Open VirtualBox and go to `File > Preferences`.
2. Navigate to the `Network` section and click on the `NAT Networks` tab.
3. Click the `+` icon to add a new NAT Network.
4. Configure the NAT Network:
   - Name: `NATNetwork` (or any preferred name).
   - Subnet: `192.168.100.0/24`.
   - Ensure the `Supports DHCP` option is **enabled**.
5. Save the configuration.

#### 2. Attach Each VM to the NAT Network
1. Select a VM in VirtualBox and click on `Settings`.
2. Go to the `Network` tab.
3. For `Adapter 1`:
   - Enable the network adapter.
   - Set `Attached to` as `NAT Network`.
   - Select the NAT Network you created (e.g., `NATNetwork`).
4. Click `OK`.
5. Repeat these steps for all VMs.

#### 3. Following are the IP addresses that get assigned to the VMs:
   * **VM1**: `192.168.100.4`
   * **VM2**: `192.168.100.5`
   * **VM3**: `192.168.100.6`

### 2. Backend Setup on VM1

1. Install Node.js and `npm`:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

2. Create the backend application:
   ```bash
   mkdir microservice && cd microservice
   npm init -y
   npm install express mongoose
   ```

3. Backend Code (`index.js`):
   ```javascript
    const express = require('express'); 
    const mongoose = require('mongoose'); 
    const app = express(); 
    const PORT = process.env. PORT || 3000; 
    
    // Connect to MongoDB (hostel on VM2) 
    mongoose.connect('mongodb://198.168.100.5:27017/mydb', { 
            useNewUrlParser: true, 
            useUnified Topology: true 
    }).then(() => { 
            console.log('Connected to MongoDB'); 
    }).catch(err => { 
            console.error('MongoDB connection error:', err); 
    }); 
    
    app.use (express.json()); 
    
    app.get('/api/hello', async (req, res) => { 
            try { 
                    const data = await mongoose.connection.db.collection('test').findOne({}); 
                    res.json({ message: data.message }); 
            } catch (err) { 
                    res.status(500).json({ error: 'Database error' }); 
            } 
    }); 
    
    app.listen(PORT, () => { 
            console.log(Service running on port ${PORT}); 
    });
   ```

4. Start the backend:
   ```bash
   node index.js
   ```

### 3. MongoDB Setup on VM2

1. Install MongoDB:
   ```bash
   sudo apt update
   
   sudo apt-get install gnupg curl
   curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] \
   https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

   sudo apt-get update

   sudo apt-get install -y mongodb-org

   sudo systemctl start mongod
   ```

2. Allow external connections by editing `/etc/mongod.conf`:
   ```yaml
   bindIp: 0.0.0.0
   ```

   Restart MongoDB:
   ```bash
   sudo systemctl restart mongod
   ```

3. Insert sample data:
   ```bash
   mongosh
   use mydb
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
   curl http://192.168.100.4:3000/api/hello
   ```

3. You should receive the following response:
   ```json
   {
     "message": "Hello from MongoDB!"
   }
   ```

Feel free to fork and enhance the project!
