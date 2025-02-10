# Microservice Deployment Across Virtual Machines  

## Overview  
This project demonstrates the deployment of a simple microservice-based application across three Virtual Machines (VMs) using VirtualBox. The application consists of:  
- A **Node.js backend** hosted on VM1.  
- A **MongoDB database** hosted on VM2.  
- A **client testing the backend** using `curl` from VM3.  

## Architecture  
- **VM1**: Hosts the backend (Node.js REST API).  
- **VM2**: Hosts the MongoDB database.  
- **VM3**: Acts as the client, sending requests to the backend and receiving responses.  

---

## Prerequisites  
1. VirtualBox installed on your system.  
2. Three VMs running Ubuntu CLI (minimal install).  
3. Static IP addresses assigned to each VM.  

---

## Steps to Deploy  

### 1. Configure the Network  
1. Set up an **Internal Network** in VirtualBox for all VMs.  
2. Assign static IP addresses to the VMs as follows:  
   - **VM1**: `192.168.1.101`  
   - **VM2**: `192.168.1.102`  
   - **VM3**: `192.168.1.103`  

---

### 2. Backend Setup on VM1  
1. Install Node.js and `npm`:  
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
