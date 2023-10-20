// src/components/RentalComponent.tsx

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:7545'); // Connect to Ganache.

interface IRentalComponentProps {
    contractAddress: string;
    contractABI: any[];
}

const RentalComponent: React.FC<IRentalComponentProps> = ({ contractAddress, contractABI }) => {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0] || null);
        };
        init();
    }, []);

    const addParticipant = async () => {
        if(!account) return;

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
//            await contract.methods.addParticipant("Alice", "12345", "alice@mail.com", "123 Street", true, false).send({ from: account });
            alert("Participant added!");
        } catch (error) {
            console.error("An error occurred:", error);
            alert("Error while adding participant!");
        }
    };

    return (
        <div>
            <h2>Rental Contract Interaction</h2>
            <button onClick={addParticipant}>Add Participant</button>
        </div>
    );
};

export default RentalComponent;
