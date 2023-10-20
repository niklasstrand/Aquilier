import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from '../contracts/Rental.abi.json';




const MetaMaskLogin: React.FC = () => {
  const handleLogin = async () => {
    try {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        alert('Logged in!');
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to login with MetaMask.');
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with MetaMask</button>
    </div>
  );
};

export default MetaMaskLogin;


const Aquilier: React.FC = () => {
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum as any);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          
          const contractAddress = "YOUR_CONTRACT_ADDRESS";
          const rentalContract = new web3.eth.Contract(abi as any, contractAddress);
          setContract(rentalContract);
        } catch (error) {
          console.error("User rejected account access", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    loadBlockchainData();
  }, []);

  const createAccount = async () => {
    if (contract && account) {
      try {
        await contract.methods.addParticipant(
          "Alice",
          "12345",
          "alice@mail.com",
          "123 Street",
          true,
          false
        ).send({ from: account });
        alert("Participant added!");
      } catch (error) {
        console.error("Error adding participant:", error);
      }
    } else {
      alert("Wallet not connected or contract not loaded!");
    }
  };

  return (
    <div>
      <h2>Rental Contract Interaction</h2>
      <button onClick={createAccount}>Create Account</button>
      {/* Other contract interactions go here */}
    </div>
  );
};
