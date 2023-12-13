
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import contractABI from '../contracts/abi/UserRegistry.abi.json';


const UserRegistryComponent: React.FC = () => {
    // State for storing user's account
    const [account, setAccount] = useState<string | null>(null);

    // Web3 initialization
    const infuraWsUrl = "wss://sepolia.infura.io/ws/v3/8568dcbfcab044ffa3d0ab39952981b5";
    const web3 = new Web3(new Web3.providers.WebsocketProvider(infuraWsUrl));
    const contractAddress = '0x6F201d54a7772A7E85FBb8F4904EA3287236bb22';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // State for storing user input
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [physicalAddress, setPhysicalAddress] = useState("");

    // Effect hook to get and set the user's Ethereum account
    useEffect(() => {
        const init = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0] || null);
        };
        init();
    }, []);

    // Function to handle adding a user
    const addUser = async () => {
        if (!account) return;

        try {
            await (contract.methods.addUser as any)(
                name,
                phone,
                email,
                physicalAddress
            ).send({ from: account });
            
            alert("User added successfully!");
        } catch (error) {
            console.error("An error occurred:", error);
            alert("Error while adding user!");
        }
    };

    // JSX for the component
    return (
        <div>
            <h2>User Registry</h2>
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={e => setName(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Phone" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Physical Address" 
                value={physicalAddress} 
                onChange={e => setPhysicalAddress(e.target.value)}
            />
            <button onClick={addUser}>Add User</button>
        </div>
    );
};

export default UserRegistryComponent;
