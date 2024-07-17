# Balthazar NFT Viewer - Backend

## Overview

Balthazar NFT Viewer is a web application that allows users to view NFT data for a given Ethereum wallet address and collection. This repository contains the backend service built with NestJS. The backend interacts with the OpenSea API to fetch NFT data and uses Redis for caching to enhance performance.

## Technologies and APIs

### Backend

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Axios**: A promise-based HTTP client for the browser and Node.js.
- **Redis**: An in-memory data structure store used as a cache to improve performance.

### APIs

- **OpenSea API**: Provides access to NFT data on the Ethereum blockchain.

## Instructions to Set Up and Run the Project

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- Redis (for caching, optional)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nuwanrg/balthazar-backend.git
   cd balthazar-backend
   ```

````

2. **Install Dependencies**
  ```bash
  npm install
````

3. **Set Up Environment Variables**
   Create a .env file in the balthazar-backend directory with the following content:

```bash
OS_GET_NFT_URL=https://api.opensea.io/api/v2/chain/ethereum/account
OS_API_KEY=your_opensea_api_key
USE_CACHE=true
REDIS_URL=redis://localhost:6379
```
