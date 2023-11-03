import axios from 'axios';
import bookingManagementABI from '../contract/BookingManagement.abi.json';

// Import necessary types and classes from web3
import { Web3 } from 'web3'; 
import { Contract } from 'web3-eth-contract';

// 1. Setup web3 provider
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545')); 
web3.eth.net.isListening()
  .then(() => console.log('Connected to the Ethereum node'))
  .catch(e => console.error('Failed connecting to the Ethereum node', e));

  (async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("First account balance:", await web3.eth.getBalance(accounts[0]));
})();
// 3. Address of the deployed BookingManagement contract
const bookingManagementAddress = '0x167fF147960Cb1b8481c89A13efF156584C54426';

// 4. Create a contract instance
const bookingManagementContract = new web3.eth.Contract(bookingManagementABI, bookingManagementAddress);

// 5. Listen to the BookingApproved event

bookingManagementContract.events.AccessGranted({
    fromBlock: 'earliest'  // start listening from the latest block
})
.on('data', (event) => {
    console.log('Access Granted:', event);
    const bookingId = event.returnValues.bookingId;
    const userAddress = event.returnValues.userAddress;
    unlockVirtualLock()
})


async function unlockVirtualLock() {
    // Replace with your Home Assistant API endpoint and token
    const apiUrl = 'http://localhost:8123/api/services/input_boolean/toggle';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1M2ZmNjFkYzA1MWE0ZGM0YTM4NzIwMWY0MWY0MTRmYiIsImlhdCI6MTY5ODA2MTU1MCwiZXhwIjoyMDEzNDIxNTUwfQ.GyNUECFqs6cae0B1FyxUjE6K5qjNK-veuphsOpRUA9g';

    try {
        const response = await axios.post(
            apiUrl,
            {
                entity_id: 'input_boolean.virtual_lock'
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Virtual lock unlocked:', response.data);
    } catch (error) {
        console.error('Error unlocking virtual lock:', error);
    }
}
