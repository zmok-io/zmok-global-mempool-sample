# ZMOK Global Tx Pool - Sample Project

## Introduction
This project demonstrates the use of ZMOK's `zmk_txpool_tx_subscribe` and `zmk_txpool_query` methods to track and display all pending transactions for a sample NFT minting contract. The project uses React for the frontend and Parcel for bundling the application.

**Note:** These ZMOK methods are only available for Premium users.

## Getting Started

### Prerequisites
- Node.js and npm installed
- [A Premium ZMOK account](https://dashboard.zmok.io/upgrade).

### Installation
Clone this repository, then navigate to the project directory and run the following commands:

```bash
npm install
npm start
```

This will install the necessary dependencies and start the application on http://localhost:1234.

### Configuration
Make sure to replace the placeholder in the WebSocket client setup with your own ZMOK endpoint:

```js
// Replace with your ZMOK endpoint
const client = new W3CWebSocket("wss://api.zmok.io/mainnet/YOUR_APP_ID")
```
###  URL Query Parameters
This application supports the following URL query parameters:

to: The Ethereum address of the contract you want to track. If no to parameter is provided, it will default to 0x9faFfeb7e7f0F46aCA2Ce6654de93c634F15da21.

form: Set this parameter to true to display a form at the top of the page that allows you to change the to address without modifying the URL manually.

Here's an example of how to use these parameters:

```url
http://localhost:1234?to=0xYourContractAddressHere&form=true
```

With this URL, the application will track the transactions of the address 0xYourContractAddressHere, and a form will be displayed at the top of the page to allow you to easily change the tracked address.

## Upgrade to ZMOK Premium
To access the full functionality of ZMOK, including the `zmk_txpool_tx_subscribe` and `zmk_txpool_query` methods used in this project, consider upgrading to a Premium account. For more information, visit the [ZMOK Dashboard](https://dashboard.zmok.io/upgrade).