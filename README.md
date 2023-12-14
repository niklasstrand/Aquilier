# Aquilier

Welcome to Aquilier, a decentralized application (DApp) designed for property booking on the blockchain. This application is part of a master thesis exploring the integration of blockchain technology in real estate.

## Overview

Aquilier leverages blockchain technology to provide a secure and transparent platform for property bookings. Users can list their properties for rent and manage bookings through a user-friendly interface while ensuring data integrity and trust through smart contract implementation.

## Features

- Property Listing: Users can list their properties with details such as location, rate, and availability.
- MetaMask Integration: Secure login and transaction signing with MetaMask.
- Smart Contract Interaction: Direct interaction with Ethereum smart contracts for booking and management.

## Getting Started

Follow the steps below to get started with Aquilier:

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

- Docker and Docker Compose should be installed on your system.
- Ensure you have cloned the Aquilier repository or have access to the necessary files.

### Installation

To set up the project on your local machine:

1. Clone the repository:

### To run the frontend: 
```bash
cd aquilier/app/front
npm install
npm install web3
npm start
```

### To run the proxy: 
```bash
cd Aquilier/app/backend/proxy/
docker build -t aqilier .
docker run -p 8080:8080 aqilier
```

### To run the Home assistant: 
```bash
cd iot/
docker-compose up -d
```


Navigate to http://localhost:8123/ 
login using our test user niklas and password 123secret
