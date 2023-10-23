import Web3 from 'web3';
import axios from 'axios';
import { Contract } from 'web3-eth-contract';

// Import the ABI
import bookingManagementABI from '../contract/BookingManagement.abi.json';

// 1. Setup web3 provider
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545')); // assuming Ganache is running on this endpoint


// 3. Address of the deployed BookingManagement contract
const bookingManagementAddress = '0xa0C5BD86c0494C121ff180A15542481964B9b0A2';

// 4. Create a contract instance
const bookingManagementContract = new web3.eth.Contract(bookingManagementABI, bookingManagementAddress);

// 5. Listen to the BookingApproved event


(bookingManagementContract.events.BookingApproved as any)({})
    .once('data', (event: any) => {
        console.log('Booking approved detected:', event);
        unlockVirtualLock().catch(err => {
            console.error('Error unlocking virtual lock:', err);
        });
    })
    .once('error', (error: any) => {
        console.error('Error on event:', error);
    });

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

