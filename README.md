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

### Installation

To set up the project on your local machine:

1. Clone the repository:

To run the frontend: 

```bash
git clone [repository-url]
cd aquilier/app/front
npm install
npm install web3
```

To run the proxy: 
```bash
git clone [repository-url]
cd aquilier/app/backend/oracle
go run proxy.go
```

Aquilier seeks to establish a direct, secure, and transparent conduit between property owners and renters by facilitating an agreed-upon smart contract. The primary objective is to explore and showcase how blockchain systems can ensure unerring access to a property for a rightful tenant based on the parameters set and agreed upon within the smart contract.

### Focus Areas

- **Smart Contract Enforcement:** Enabling property access to tenants based on the verifiable and self-executing smart contracts agreed upon between the renter and the property owner.
  
- **Decentralization:** Minimizing the need for intermediaries by facilitating direct interactions between renters and property owners in a decentralized manner.

- **Security and Trust:** Ensuring secure and trustworthy transactions and agreements between parties through the inherent characteristics of blockchain.

Through the seamless integration of blockchain technology, Aquilier not only emphasizes secure and transparent transactions but also explores the multifaceted utilities of smart contracts in real-world applications, specifically in the realm of property rental and management.


## Documentation Index

1. [Components](doc/component.md)
2. [Architecture map](doc/architecture.md)